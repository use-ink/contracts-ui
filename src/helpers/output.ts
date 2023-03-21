// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  AbiMessage,
  AnyJson,
  Bytes,
  ContractExecResult,
  ContractReturnFlags,
  Registry,
  TypeDef,
} from 'types';

type ContractResultErr = {
  Err: AnyJson;
};

type ContractResultOk = {
  Ok: AnyJson;
};

function isErr(o: ContractResultErr | ContractResultOk | AnyJson): o is ContractResultErr {
  return typeof o === 'object' && o !== null && 'Err' in o;
}

function isOk(o: ContractResultErr | ContractResultOk | AnyJson): o is ContractResultOk {
  return typeof o === 'object' && o !== null && 'Ok' in o;
}

function getReturnTypeName(type: TypeDef | null | undefined) {
  return type?.lookupName || type?.type || '';
}

function decodeReturnValue(
  returnType: TypeDef | null | undefined,
  data: Bytes,
  registry: Registry
): AnyJson {
  const returnTypeName = getReturnTypeName(returnType);
  return returnType ? registry.createTypeUnsafe(returnTypeName, [data]).toHuman() : '()';
}

function checkRevertFlag(flags: ContractReturnFlags): boolean {
  const decodedFlags = flags.toHuman();
  return decodedFlags.includes('Revert');
}

function extractOutcome(returnValue: AnyJson): AnyJson {
  return isOk(returnValue) ? returnValue.Ok : isErr(returnValue) ? returnValue.Err : returnValue;
}

function getErrorText(outcome: AnyJson): string {
  return isErr(outcome)
    ? typeof outcome.Err === 'object'
      ? JSON.stringify(outcome.Err, null, 2)
      : outcome.Err?.toString() ?? 'Error'
    : outcome !== 'Ok'
    ? outcome?.toString() || 'Error'
    : 'Error';
}

function getOkText(outcome: AnyJson, returnValue: AnyJson) {
  return isOk(returnValue)
    ? typeof outcome === 'object'
      ? JSON.stringify(outcome, null, '\t')
      : outcome?.toString() ?? '()'
    : JSON.stringify(outcome, null, '\t') ?? '()';
}

export function getDecodedOutput(
  { result }: Pick<ContractExecResult, 'result' | 'debugMessage'>,
  { returnType }: AbiMessage,
  registry: Registry
): {
  decodedOutput: string;
  isError: boolean;
} {
  let decodedOutput = '';
  let isError = true;
  if (result.isOk) {
    isError = checkRevertFlag(result.asOk.flags);
    const r = decodeReturnValue(returnType, result.asOk.data, registry);
    const o = extractOutcome(r);
    decodedOutput = isError ? getErrorText(o) : getOkText(o, r);
  }
  return {
    decodedOutput,
    isError,
  };
}
