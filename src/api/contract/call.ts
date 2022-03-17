// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { transformUserInput } from 'api/util';

import {
  BlueprintOptions,
  ContractQuery,
  ContractOptions,
  ContractTx,
  KeyringPair,
  ContractDryRunParams,
} from 'types';

export function prepareContractTx(
  tx: ContractTx<'promise'>,
  options: BlueprintOptions,
  args: unknown[]
) {
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
