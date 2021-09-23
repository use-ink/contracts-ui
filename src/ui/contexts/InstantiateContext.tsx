// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React, { useState, useContext, useCallback, useMemo, useEffect } from 'react';
import BN from 'bn.js';
import { useParams } from 'react-router';
import { randomAsHex } from '@polkadot/util-crypto';
import { AbiConstructor } from '@polkadot/api-contract/types';
import { isNumber } from '@polkadot/util';
import { AnyJson, BlueprintPromise, ContractPromise, EventRecord, FileState, InstantiateState } from 'types';
import { useCodeBundle } from 'ui/hooks/useCodeBundle';
import { useWeight } from 'ui/hooks/useWeight';
import { useMetadata } from 'ui/hooks/useMetadata';
import { useNonEmptyString } from 'ui/hooks/useNonEmptyString';
import { useFormField } from 'ui/hooks/useFormField';
import { useToggle } from 'ui/hooks/useToggle';
import { useStepper } from 'ui/hooks/useStepper';
import { useAccountId } from 'ui/hooks/useAccountId';
import { useBalance } from 'ui/hooks/useBalance';
import { createEmptyValues } from 'canvas';
import { useArgValues } from 'ui/hooks/useArgValues';

export const InstantiateContext = React.createContext({} as unknown as InstantiateState);

export function toBalance(value: number | BN | string, decimals: number): BN {
  return new BN(value).muln(10 ^ decimals);
}

export function InstantiateContextProvider ({ children }: React.PropsWithChildren<Partial<InstantiateState>>) {
  const { codeHash } = useParams<{codeHash: string}>();
  const { data: codeBundle } = useCodeBundle(codeHash || undefined);

  const step = useStepper();
  const isLoading = useToggle(true);
  const isSuccess = useToggle(false);

  const isUsingStoredMetadata = useToggle(!!codeBundle);

  const accountId = useAccountId();

  const name = useNonEmptyString();
  const metadataFile = useState<FileState | undefined>()

  const { onChange: setName } = name;
  const [, setMetadataFile] = metadataFile;

  const onMetadataChange = useCallback(
    (newFile: FileState) => {
      setMetadataFile(newFile);
      if (newFile.name && newFile.name.length > 0 && (!name.value || name.value === '')) {
        setName(newFile.name.replace(/\.contract$/, ''));
      }
    },
    [name.value]
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
  const endowment = useBalance(1000);
  const weight = useWeight();
  const isUsingSalt = useToggle();
  const salt = useNonEmptyString(randomAsHex());

  const deployConstructor = useMemo(
    (): AbiConstructor | null => isNumber(constructorIndex.value) ? (metadata.value?.constructors[constructorIndex.value] || null) : null,
    [metadata.value, constructorIndex.value]
  );

  const argValues = useArgValues(deployConstructor?.args || []);

  // const [, setArgValues] = argValues;

  // useEffect(
  //   (): void => {
  //     deployConstructor?.args && setArgValues(createEmptyValues(deployConstructor?.args))
  //   },
  //   [deployConstructor?.args]
  // )

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
    deployConstructor,
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
