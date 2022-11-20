// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AbiMessage, ContractExecResult, Registry } from 'types';

export function useDecodedOutput(
  result: ContractExecResult['result'],
  message: AbiMessage,
  registry: Registry
): {
  decodedOutput: string;
  isError: boolean;
} {
  const r =
    result.isOk && message.returnType
      ? registry.createTypeUnsafe(
          message.returnType.lookupName || message.returnType.type,
          [result.asOk.data.toU8a(true)],
          { isPedantic: true }
        )
      : null;
  const o = r?.toHuman();
  const isError = o !== null && typeof o === 'object' && 'Err' in o;

  const decodedOutput = isError
    ? typeof o.Err === 'string'
      ? o.Err
      : JSON.stringify(o.Err, null, 2)
    : typeof o === 'object'
    ? JSON.stringify(o, null, '\t')
    : o?.toString() ?? '()';

  return {
    decodedOutput,
    isError,
  };
}
