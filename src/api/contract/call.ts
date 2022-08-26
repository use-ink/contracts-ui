// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { transformUserInput } from 'api/util';

import {
  BlueprintOptions,
  ContractQuery,
  ContractOptions,
  ContractTx,
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
  address: string,
  options: ContractOptions,
  args: unknown[]
) {
  return args?.length > 0 ? query(address, options, ...args) : query(address, options);
}

export function dryRun({
  contract,
  message,
  payment: value,
  address,
  argValues,
}: ContractDryRunParams) {
  const { isPayable, method } = message;
  const transformed = transformUserInput(contract.registry, message.args, argValues);

  return sendContractQuery(
    contract.query[method],
    address,
    { gasLimit: -1, value: isPayable ? value : 0 },
    transformed
  );
}
