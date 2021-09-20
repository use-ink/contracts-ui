// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React, { useState, useContext, useCallback } from 'react';

import { useParams } from 'react-router';
import { useCanvas } from './CanvasContext';
import { AnyJson, BlueprintPromise, ContractPromise, EventRecord, FileState, InstantiateState } from 'types';
import { useCodeBundle } from 'ui/hooks/useCodeBundle';
import { useWeight } from 'ui/hooks/useWeight';
import { useMetadata } from 'ui/hooks/useMetadata';
import { useNonEmptyString } from 'ui/hooks/useNonEmptyString';
import { useFormField } from 'ui/hooks/useFormField';
import { useToggle } from 'ui/hooks/useToggle';
import { useNonZeroBn } from 'ui/hooks/useNonZeroBn';

export const InstantiateContext = React.createContext({} as unknown as InstantiateState);

export function InstantiateContextProvider ({ children }: React.PropsWithChildren<Partial<InstantiateState>>) {
  const { keyring } = useCanvas();
  const { codeHash } = useParams<{codeHash: string}>();

  const step = useState(0);
  const isLoading = useToggle(true);
  const isSuccess = useToggle(false);

  const { data: codeBundle } = useCodeBundle(codeHash || undefined);
  const isUsingStoredMetadata = useToggle(!!codeBundle);

  const accountId = useFormField<string | null>(
    keyring?.getAccounts()[0].address.toString() || null
  );

  const name = useNonEmptyString();
  const metadataFile = useState<FileState | undefined>()

  const [, setName] = name;
  const [, setMetadataFile] = metadataFile;

  const onMetadataChange = useCallback(
    (newFile: FileState) => {
      setMetadataFile(newFile);
      if (newFile.name && newFile.name.length > 0 && (!name || name[0] === '')) {
        setName(newFile.name);
      }
    },
    [name[0]]
  );

  const onMetadataRemove = useCallback(
    () => {
      setMetadataFile(undefined);
    },
    []
  );

  const metadata = useMetadata(
    codeBundle?.abi as AnyJson || null,
    {
      isRequired: true,
      isWasmRequired: !codeBundle || !isUsingStoredMetadata,
      onChange: onMetadataChange,
      onRemove: onMetadataRemove
    }
  );

  const constructorIndex = useFormField(0);
  const argValues = useState<Record<string, string>>({});
  const endowment = useNonZeroBn();
  const weight = useWeight();
  const isUsingSalt = useToggle();
  const salt = useNonEmptyString();

  const events = useState<EventRecord[]>([]);
  const contract = useState<ContractPromise | null>(null);

  const onInstantiate = useCallback(
    ([_, __]: [ContractPromise, BlueprintPromise | undefined]) => {
      // todo
    },
    []
  );

  const state: InstantiateState = {
    accountId,
    codeHash,
    constructorIndex,
    contract,
    argValues,
    endowment,
    events,
    isLoading,
    isSuccess,
    isUsingSalt,
    isUsingStoredMetadata,
    metadata,
    metadataFile,
    name,
    onInstantiate,
    salt,
    step,
    weight
  }

  return (
    <InstantiateContext.Provider value={state}>
      {children}
    </InstantiateContext.Provider>
  );

};

export const useInstantiate = () => useContext(InstantiateContext);
