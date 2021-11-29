// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isWasm, u8aToString } from '@polkadot/util';
import { useEffect, useState } from 'react';
import { useApi } from 'ui/contexts/ApiContext';
import {
  Abi,
  AnyJson,
  ApiPromise,
  FileState,
  MetadataState,
  UseMetadata,
  Validation,
  VoidFn,
} from 'types';

type OnChange = (_: FileState | undefined, __?: AnyJson) => void;
type OnRemove = VoidFn;

interface Options {
  isRequired?: boolean;
  isWasmRequired?: boolean;
}

interface DeriveOptions extends Options {
  name?: string;
}

interface Callbacks {
  onChange?: OnChange;
  onRemove?: OnRemove;
}

function deriveFromJson(
  source: AnyJson = null,
  options: DeriveOptions,
  api?: ApiPromise | null
): MetadataState {
  if (!source) {
    return EMPTY;
  }

  let value: Abi | undefined = undefined;

  try {
    value = new Abi(source, api?.registry.getChainProperties());

    const name = options.name || value.info.contract.name.toString();

    return {
      source,
      name,
      value,
      isSupplied: true,
      ...validate(value, options),
    };
  } catch (e) {
    console.error(e);

    return {
      source,
      name: '',
      value,
      isSupplied: true,
      ...validate(value, options),
    };
  }
}

const EMPTY: MetadataState = {
  isError: false,
  isSupplied: false,
  isValid: false,
  name: '',
  source: null,
  message: null,
};

function validate(metadata: Abi | undefined, { isWasmRequired }: Options): Validation {
  if (!metadata) {
    return {
      isValid: false,
      isError: true,
      message:
        'Invalid contract file format. Please upload the generated .contract bundle for your smart contract.',
    };
  }

  const wasm = metadata.info.source.wasm;
  const isWasmEmpty = wasm.isEmpty;
  const isWasmInvalid = !isWasm(wasm.toU8a());

  if (isWasmRequired && (isWasmEmpty || isWasmInvalid)) {
    return {
      isValid: false,
      isError: true,
      message: 'This contract bundle has an empty or invalid WASM field.',
    };
  }

  return {
    isValid: true,
    isError: false,
    isSuccess: true,
    message: isWasmRequired ? 'Valid contract bundle!' : 'Valid metadata file!',
  };
}

export function useMetadata(
  initialValue: AnyJson = null,
  options: Options & Callbacks = {}
): UseMetadata {
  const { api } = useApi();

  const { isRequired = false, isWasmRequired = false, ...callbacks } = options;
  const [state, setState] = useState<MetadataState>(() =>
    deriveFromJson(initialValue, { isRequired, isWasmRequired }, api)
  );

  function onChange(file: FileState): void {
    try {
      const json = JSON.parse(u8aToString(file.data)) as AnyJson;
      const name = file.name.replace('.contract', '').replace('.json', '').replace('_', ' ');

      const newState = deriveFromJson(json, { isRequired, isWasmRequired, name }, api);

      setState(newState);

      callbacks.onChange && callbacks.onChange(file, json);
    } catch (error) {
      console.error(error);

      setState({
        ...EMPTY,
        message: 'This contract file is not in a valid format.',
        isError: true,
        isSupplied: true,
        isValid: false,
      });
    }
  }

  function onRemove(): void {
    setState(EMPTY);

    callbacks.onChange && callbacks.onChange(undefined);
    callbacks.onRemove && callbacks.onRemove();
  }

  useEffect((): void => {
    setState(deriveFromJson(initialValue, { isRequired, isWasmRequired }, api));
  }, [api, initialValue, isRequired, isWasmRequired]);

  return {
    ...state,
    onChange,
    onRemove,
  };
}
