// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { encodeSalt, transformUserInput } from 'api/util';

import {
  ContractPromise,
  ContractQuery,
  ContractTx,
  ContractCallParams,
  CallResult,
  RegistryError,
} from 'types';

let nextId = 0;

export function prepareContractTx(
  tx: ContractTx<'promise'>,
  options: { gasLimit: number; salt: Uint8Array; value: number },
  args: unknown[]
) {
  return args.length > 0 ? tx(options, ...args) : tx(options);
}

export function sendContractQuery(
  options: { endowment: number; gasLimit: number },
  fromAddress: string,
  query: ContractQuery<'promise'>,
  args: unknown[]
) {
  return args?.length > 0 ? query(fromAddress, options, ...args) : query(fromAddress, options);
}

export async function call({
  api,
  abi,
  contractAddress,
  message,
  endowment,
  gasLimit,
  keyringPair,
  argValues,
  dispatch,
}: ContractCallParams) {
  const contract = new ContractPromise(api, abi, contractAddress);
  const salt = encodeSalt();
  const transformed = transformUserInput(api, message.args, argValues);

  const callResult: CallResult = {
    id: ++nextId,
    isComplete: false,
    data: '',
    log: [],
    message,
    time: Date.now(),
  };

  if (keyringPair) {
    dispatch({ type: 'CALL_INIT', payload: callResult });
    if (message.isMutating || message.isPayable) {
      const tx = prepareContractTx(
        contract.tx[message.method],
        { gasLimit, value: endowment, salt },
        transformed
      );

      const unsub = await tx.signAndSend(keyringPair, result => {
        const { status, events, dispatchError, dispatchInfo } = result;

        const log = events.map(({ event }) => {
          return `${event.section}:${event.method}`;
        });

        let error: RegistryError | undefined;

        if (status.isFinalized) {
          if (dispatchError) {
            error = api.registry.findMetaError(dispatchError.asModule);
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
        { gasLimit, endowment },
        keyringPair.address,
        contract.query[message.method],
        transformed
      );

      let error: RegistryError | undefined;

      if (result.isErr && result.asErr.isModule) {
        error = api.registry.findMetaError(result.asErr.asModule);
      }

      dispatch({
        type: 'CALL_FINALISED',
        payload: { ...callResult, data: output?.toHuman(), error },
      });
    }
  } else {
    console.error('Kering pair not found');
  }
}
