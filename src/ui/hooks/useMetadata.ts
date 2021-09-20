import { u8aToString } from '@polkadot/util';
import { useCallback, useEffect, useState } from 'react';
import { Abi, AnyJson, ApiPromise, FileState, MetadataState, UseMetadata, VoidFn } from 'types';
import { useCanvas } from 'ui/contexts/CanvasContext';

type OnChange = (_: FileState, __?: AnyJson) => void;
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

function deriveFromJson (source: AnyJson = null, { isRequired, isWasmRequired, ...options }: DeriveOptions, api?: ApiPromise | null): MetadataState {
  if (!source) {
    return EMPTY;
  }

  try {
    let isError = false;
    let errorText = null;

    const value = new Abi(source, api?.registry.getChainProperties());

    const name = options.name || value.project.contract.name.toString();

    const isWasmEmpty = value.project.source.wasm.isEmpty;

    if (isWasmRequired && isWasmEmpty) {
      isError = true;
      errorText = 'This metadata file has no WASM field.'
    }

    return {
      source,
      name,
      value,
      errorText,
      isError,
      isSupplied: true,
      isValid: (!isRequired || !!value) && !isError
    };
  } catch (e) {
    console.error(e);
    
    return {
      source,
      name: null,
      value: null,
      errorText: 'Invalid contract bundle format',
      isError: true,
      isSupplied: true,
      isValid: false
    };
  }
}

const EMPTY: MetadataState = {
  source: null,
  name: null,
  value: null,
  errorText: null,
  isError: false,
  isSupplied: false,
  isValid: false
};

export function useMetadata (initialValue: AnyJson = null, options: Options & Callbacks = {}): UseMetadata {
  const { api } = useCanvas();

  const { isRequired = false, isWasmRequired = false, ...callbacks } = options;
  const [state, setState] = useState<MetadataState>(() => deriveFromJson(initialValue, { isRequired, isWasmRequired }, api));

  useEffect(
    () => setState((state) =>
      initialValue && state.source !== initialValue
        ? deriveFromJson(initialValue, { isRequired, isWasmRequired }, api)
        : state
    ),
    [initialValue, isRequired, isWasmRequired]
  );

  const onChange = useCallback(
    (file: FileState): void => {
      try {
        const json = JSON.parse(u8aToString(file.data)) as AnyJson;
        const name = file.name.replace('.contract', '').replace('.json', '').replace('_', ' ');

        const newState = deriveFromJson(json, { isRequired, isWasmRequired, name }, api);

        setState(newState);

        callbacks.onChange && callbacks.onChange(file, json)
      } catch (error) {
        console.error(error);

        setState({ ...EMPTY, errorText: (error as Error).message, isError: true, isSupplied: true, isValid: false });
      }
    },
    [callbacks.onChange, isRequired, isWasmRequired]
  );

  const onRemove = useCallback(
    (): void => {
      setState(EMPTY);

      callbacks.onRemove && callbacks.onRemove();
    },
    [callbacks.onRemove]
  );

  return {
    ...state,
    onChange,
    onRemove
  };
}

