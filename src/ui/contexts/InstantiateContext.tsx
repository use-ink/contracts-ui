// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React, { useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { randomAsHex } from '@polkadot/util-crypto';
import { AbiConstructor } from '@polkadot/api-contract/types';
import { isHex, isNumber } from '@polkadot/util';
import { useCanvas } from './CanvasContext';
import { useDatabase } from './DatabaseContext';
import { AnyJson, BlueprintPromise, ContractPromise, FileState, InstantiateProps, InstantiateState, SubmittableExtrinsic, OnInstantiateSuccess$Code, OnInstantiateSuccess$Hash, CodeSubmittableResult, BlueprintSubmittableResult } from 'types';
import { useCodeBundle } from 'ui/hooks/useCodeBundle';
import { useWeight } from 'ui/hooks/useWeight';
import { useMetadata } from 'ui/hooks/useMetadata';
import { useNonEmptyString } from 'ui/hooks/useNonEmptyString';
import { useFormField } from 'ui/hooks/useFormField';
import { useToggle } from 'ui/hooks/useToggle';
import { useStepper } from 'ui/hooks/useStepper';
import { useAccountId } from 'ui/hooks/useAccountId';
import { useBalance } from 'ui/hooks/useBalance';
import { useArgValues } from 'ui/hooks/useArgValues';
import { createInstantiateTx, onInsantiateFromHash, onInstantiateFromCode } from 'canvas/instantiate';

export const InstantiateContext = React.createContext({} as unknown as InstantiateProps);

type TxState = [SubmittableExtrinsic<'promise'> | null, OnInstantiateSuccess$Code | OnInstantiateSuccess$Hash, string | null];

const NOOP = () => Promise.resolve();

export const CONTRACT_FILE = 0;
export const DEPLOYMENT_INFO = 1;
export const FINALIZE = 2;

export function isResultValid ({ contract }: CodeSubmittableResult<'promise'> | BlueprintSubmittableResult<'promise'>): boolean {
  return !!contract;
}

export function InstantiateContextProvider ({ children }: React.PropsWithChildren<Partial<InstantiateProps>>) {
  const history = useHistory();
  const { codeHash } = useParams<{codeHash: string}>();
  const apiState = useCanvas();
  const dbState = useDatabase();

  const codeBundleQuery = useCodeBundle(codeHash || undefined);

  const [, codeBundle] = codeBundleQuery.data || [false, null];
  const isLoading = useMemo(
    () => !!codeHash && codeBundleQuery.isLoading,
    [codeHash, codeBundleQuery.isLoading]
  );

  const step = useStepper();
  const [, , , setStep] = step;

  const isUsingStoredMetadata = useToggle(!!codeBundle);

  const accountId = useAccountId();

  const name = useNonEmptyString();
  const metadataFile = useState<FileState | undefined>()

  const { onChange: setName } = name;
  const [, setMetadataFile] = metadataFile;

  const metadata = useMetadata(
    codeBundle?.abi as AnyJson || null,
    {
      isRequired: true,
      isWasmRequired: !codeBundle || !isUsingStoredMetadata,
      onChange: setMetadataFile,
    }
  );

  const constructorIndex = useFormField(0);
  const endowment = useBalance(10000);
  const weight = useWeight();
  const isUsingSalt = useToggle();
  const salt = useFormField<string>(
    randomAsHex(),
    (value) => {
      if (!!value && isHex(value) && value.length === 66) {
        return { isValid: true }
      }

      return { isValid: false, isError: true, validation: 'Invalid hex string' }
    }
  );

  const deployConstructor = useMemo(
    (): AbiConstructor | null => isNumber(constructorIndex.value) ? (metadata.value?.constructors[constructorIndex.value] || null) : null,
    [metadata.value, constructorIndex.value]
  );
  const argValues = useArgValues(deployConstructor?.args || []);

  const onSuccess = useCallback(
    (contract: ContractPromise, _?: BlueprintPromise | undefined) => {
      history.push(`/contract/${contract.address}`);

      dbState.refreshUserData();
    },
    [dbState.refreshUserData]
  );

  const [[tx, onInstantiate, txError], setTx] = useState<TxState>([null, NOOP, null]);

  useEffect(
    (): void => {
      if (metadata.value?.project.contract.name && (!name.value || name.value === '')) {
        setName(metadata.value?.project.contract.name.toString());
      }
    },
    [metadata.value, name.value]
  )

  useEffect(
    (): void => {
      if (codeHash && !codeBundleQuery.isValid) {
        history.replace('/instantiate/hash');
      }
    },
    [codeHash, codeBundleQuery.isValid]
  )

  const state: InstantiateState = {
    accountId,
    codeHash,
    constructorIndex,
    deployConstructor,
    argValues,
    endowment,
    isLoading,
    isUsingSalt,
    isUsingStoredMetadata,
    metadata,
    metadataFile,
    onError: NOOP,
    onSuccess,
    name,
    salt,
    step,
    weight
  } as unknown as InstantiateState;

  function onFinalize () {
    try {
      const tx = createInstantiateTx(apiState.api, state);

      const onInstantiate = (codeHash ? onInsantiateFromHash : onInstantiateFromCode)(apiState, dbState, state);

      setTx([tx, onInstantiate, null]);
      setStep(FINALIZE);
    } catch (e){
      setTx([null, NOOP, 'Error creating transaction']);
    }
  }

  function onUnFinalize () {
    setTx([null, NOOP, null]);
    setStep(DEPLOYMENT_INFO);
  }

  const value = {
    ...state,
    onFinalize,
    onUnFinalize,
    onInstantiate,
    tx,
    txError,
  };

  return (
    <InstantiateContext.Provider value={value}>
      {children}
    </InstantiateContext.Provider>
  );
};

export const useInstantiate = () => useContext(InstantiateContext);
