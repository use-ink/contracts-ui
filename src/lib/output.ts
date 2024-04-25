// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import JSON5 from 'json5';
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

function stringify(o: unknown) {
  return JSON5.stringify(o, null, 2);
}

function decodeReturnValue(
  returnType: TypeDef | null | undefined,
  data: Bytes,
  registry: Registry,
): AnyJson {
  const returnTypeName = getReturnTypeName(returnType);
  let r: AnyJson = 'Decoding error';
  try {
    r = returnType ? registry.createTypeUnsafe(returnTypeName, [data]).toHuman() : '()';
  } catch (exception) {
    console.error(exception);
  }
  return r;
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
      ? stringify(outcome.Err)
      : outcome.Err?.toString() ?? 'Error'
    : outcome !== 'Ok'
      ? outcome?.toString() || 'Error'
      : 'Error';
}

function getOkText(outcome: AnyJson, returnValue: AnyJson) {
  return isOk(returnValue)
    ? typeof outcome === 'object'
      ? stringify(outcome)
      : outcome?.toString() ?? '()'
    : outcome?.toString() ?? '()';
}

export function getDecodedOutput(
  { result }: Pick<ContractExecResult, 'result' | 'debugMessage'>,
  { returnType }: AbiMessage,
  registry: Registry,
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
    decodedOutput = isError ? getErrorText(o) : getOkText(o, r) || '<empty>';
  }
  return {
    decodedOutput,
    isError,
  };
}
