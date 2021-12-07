// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN_ZERO } from '@polkadot/util';
import { encodeSalt, transformUserInput } from 'api/util';

import {
  BlueprintOptions,
  ContractQuery,
  ContractOptions,
  ContractTx,
  ContractCallParams,
  CallResult,
  RegistryError,
  KeyringPair,
  ContractDryRunParams,
} from 'types';

let nextId = 0;

function prepareContractTx(tx: ContractTx<'promise'>, options: BlueprintOptions, args: unknown[]) {
  return args.length > 0 ? tx(options, ...args) : tx(options);
}

export function sendContractQuery(
  query: ContractQuery<'promise'>,
  sender: KeyringPair,
  options: ContractOptions,
  args: unknown[]
) {
  return args?.length > 0
    ? query(sender.address, options, ...args)
    : query(sender.address, options);
}

export function dryRun({
  contract,
  message,
  payment: value,
  sender,
  argValues,
}: ContractDryRunParams) {
  const { isPayable, method } = message;
  const transformed = transformUserInput(contract.registry, message.args, argValues);

  return sendContractQuery(
    contract.query[method],
    sender,
    { gasLimit: -1, value: isPayable ? value : 0 },
    transformed
  );
}

export async function call({
  contract,
  message,
  payment: value,
  gasLimit,
  sender,
  argValues,
  dispatch,
}: ContractCallParams) {
  const salt = encodeSalt();
  const transformed = transformUserInput(contract.registry, message.args, argValues);

  const callResult: CallResult = {
    id: ++nextId,
    isComplete: false,
    data: '',
    log: [],
    message,
    time: Date.now(),
  };

  dispatch({ type: 'CALL_INIT', payload: callResult });
  if (message.isMutating || message.isPayable) {
    const tx = prepareContractTx(
      contract.tx[message.method],
      { gasLimit: gasLimit.addn(1), value: message.isPayable ? value || BN_ZERO : undefined, salt },
      transformed
    );

    const unsub = await tx.signAndSend(sender, result => {
      const { status, events, dispatchError, dispatchInfo } = result;

      const log = events.map(({ event }) => {
        return `${event.section}:${event.method}`;
      });

      let error: RegistryError | undefined;

      if (status.isFinalized) {
        if (dispatchError) {
          error = contract.registry.findMetaError(dispatchError.asModule);
        }

        dispatch({
          type: 'CALL_FINALISED',
          payload: {
            ...callResult,
            log: log,
            error,
            blockHash: status.asFinalized.toString(),
            info: dispatchInfo?.toHuman(),
          },
        });

        unsub();
      }
    });
  } else {
    const { result, output } = await sendContractQuery(
      contract.query[message.method],
      sender,
      { gasLimit, value: message.isPayable ? value || BN_ZERO : undefined },
      transformed
    );

    let error: RegistryError | undefined;

    if (result.isErr && result.asErr.isModule) {
      error = contract.registry.findMetaError(result.asErr.asModule);
    }

    dispatch({
      type: 'CALL_FINALISED',
      payload: { ...callResult, data: output?.toHuman(), error },
    });
  }
}
