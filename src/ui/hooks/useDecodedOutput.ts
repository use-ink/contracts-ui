// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import { encodeTypeDef } from '@polkadot/types';
import { isBn, fromSats } from 'helpers';
import { useApi } from 'ui/contexts';

function useSatsBalance(
  returnType: AbiMessage['returnType'],
  value: ContractCallOutcome['output']
) {
  const { api, tokenSymbol } = useApi();

  return !!returnType && encodeTypeDef(api.registry, returnType) === 'u128' && isBn(value)
    ? `${fromSats(api, value)} ${tokenSymbol}`
    : undefined;
}

export function useDecodedOutput(
  output: ContractCallOutcome['output'],
  returnType: AbiMessage['returnType']
): { decodedOutput: string; isError: boolean } {
  const o = output?.toHuman();
  const formattedBallance = useSatsBalance(returnType, output);
  const isError = o !== null && typeof o === 'object' && 'Err' in o;

  const decodedOutput = isError
    ? typeof o.Err === 'string'
      ? o.Err
      : JSON.stringify(o.Err, null, 2)
    : typeof o === 'object'
    ? JSON.stringify(o)
    : formattedBallance ?? o?.toString() ?? '';

  return {
    decodedOutput,
    isError,
  };
}
