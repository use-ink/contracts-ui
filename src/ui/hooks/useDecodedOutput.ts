// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ContractCallOutcome } from '@polkadot/api-contract/types';

export function useDecodedOutput(output: ContractCallOutcome['output']): {
  decodedOutput: string;
  isError: boolean;
} {
  const o = output?.toHuman();
  const isError = o !== null && typeof o === 'object' && 'Err' in o;

  const decodedOutput = isError
    ? typeof o.Err === 'string'
      ? o.Err
      : JSON.stringify(o.Err, null, 2)
    : typeof o === 'object'
    ? JSON.stringify(o, null, '\t')
    : o?.toString() ?? '';

  return {
    decodedOutput,
    isError,
  };
}
