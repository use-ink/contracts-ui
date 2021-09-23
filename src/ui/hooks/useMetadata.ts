import { isWasm, u8aToString } from '@polkadot/util';
import { useCallback, useEffect, useState } from 'react';
import { Abi, AnyJson, ApiPromise, FileState, MetadataState, UseMetadata, Validation, VoidFn } from 'types';
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

function deriveFromJson (source: AnyJson = null, options: DeriveOptions, api?: ApiPromise | null): MetadataState {
  if (!source) {
    return EMPTY;
  }

  let value: Abi | undefined = undefined;

  try {
    value = new Abi(source, api?.registry.getChainProperties());

    const name = options.name || value.project.contract.name.toString();

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
      name: null,
      value: null,
      isSupplied: true,
      ...validate(value, options)
    };
  }
}

const EMPTY: MetadataState = {
  isError: false,
  isSupplied: false,
  isValid: false,
  name: null,
  source: null,
  value: null,
  validation: null,
};

function validate (metadata: Abi | undefined, { isWasmRequired }: Options): Validation {
  if (!metadata) {
    return {
      isValid: false,
      isError: true,
      validation: 'Invalid contract file format. Please upload the generated .contract bundle for your smart contract.'
    };
  }

  const wasm = metadata.project.source.wasm;
  const isWasmEmpty = wasm.isEmpty;
  const isWasmInvalid = !isWasm(wasm.toU8a());

  if (isWasmRequired && (isWasmEmpty || isWasmInvalid)) {
    return {
      isValid: false,
      isError: true,
      validation: 'This contract bundle has an empty or invalid WASM field.'
    }
  }

  return {
    isValid: true,
    isError: false,
    isSuccess: true,
    validation: 'Valid contract bundle!'
  };
}

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

        setState({ ...EMPTY, validation: 'This contract file is not in a valid format.', isError: true, isSupplied: true, isValid: false });
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

