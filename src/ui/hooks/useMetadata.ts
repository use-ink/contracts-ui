// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isWasm, u8aToString } from '@polkadot/util';
import { useEffect, useState } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useApi } from 'ui/contexts/ApiContext';
import { Abi, ApiPromise, FileState, MetadataState, UseMetadata, Validation, VoidFn } from 'types';

type OnChange = (_: FileState | undefined, __?: Record<string, unknown>) => void;
type OnRemove = VoidFn;

interface Options {
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
  t: TFunction,
  options: DeriveOptions,
  source?: Record<string, unknown>,
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
      ...validate(t, value, options),
    };
  } catch (e) {
    console.error(e);

    return {
      source,
      name: '',
      value,
      isSupplied: true,
      ...validate(t, value, options),
    };
  }
}

const EMPTY: MetadataState = {
  isError: false,
  isSupplied: false,
  isValid: false,
  name: '',
  message: null,
};

function validate(t: TFunction, metadata: Abi | undefined, { isWasmRequired }: Options): Validation {
  if (!metadata) {
    return {
      isValid: false,
      isError: true,
      message:
        t('metadataInvalidFormat', 'Invalid contract file format. Please upload the generated .contract bundle for your smart contract.'),
    };
  }

  const wasm = metadata.info.source.wasm;
  const isWasmEmpty = wasm.isEmpty;
  const isWasmInvalid = !isWasm(wasm.toU8a());

  if (isWasmRequired && (isWasmEmpty || isWasmInvalid)) {
    return {
      isValid: false,
      isError: true,
      message: t('metadataWasmMissing', 'This contract bundle has an empty or invalid WASM field.'),
    };
  }

  return {
    isValid: true,
    isError: false,
    isSuccess: true,
    message: isWasmRequired
      ? t('metadataValidBundle', 'Valid contract bundle!')
      : t('metadataValidFile', 'Valid metadata file!'),
  };
}

export function useMetadata(
  initialValue?: Record<string, unknown>,
  options: Options & Callbacks = {}
): UseMetadata {
  const { t } = useTranslation();
  const { api } = useApi();

  const { isWasmRequired = false, ...callbacks } = options;
  const [state, setState] = useState<MetadataState>(() =>
    deriveFromJson(t, { isWasmRequired }, initialValue, api)
  );

  function onChange(file: FileState): void {
    try {
      const json = JSON.parse(u8aToString(file.data)) as Record<string, unknown>;
      const name = file.name.replace('.contract', '').replace('.json', '').replace('_', ' ');

      const newState = deriveFromJson(t, { isWasmRequired, name }, json, api);

      setState(newState);

      callbacks.onChange && callbacks.onChange(file, json);
    } catch (error) {
      console.error(error);

      setState({
        ...EMPTY,
        message: t('metadataInvalidFormatShort', 'This contract file is not in a valid format.'),
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
    setState(deriveFromJson(t, { isWasmRequired }, initialValue, api));
  }, [t, api, initialValue, isWasmRequired]);

  return {
    ...state,
    onChange,
    onRemove,
  };
}
