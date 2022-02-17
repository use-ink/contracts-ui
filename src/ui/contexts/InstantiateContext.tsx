// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { BN_THOUSAND } from '@polkadot/util';
import { ContractInstantiateResult } from '@polkadot/types/interfaces';
import {
  InstantiateProps,
  InstantiateState,
  CodeSubmittableResult,
  BlueprintSubmittableResult,
  InstantiateData,
  ContractPromise,
  BlueprintPromise,
  SubmittableExtrinsic,
  OnInstantiateSuccess$Code,
  OnInstantiateSuccess$Hash,
} from 'types';
import { useStepper } from 'ui/hooks/useStepper';
import { useDatabase } from 'ui/contexts/DatabaseContext';
import { onInsantiateFromHash, onInstantiateFromCode, createInstantiateTx, NOOP } from 'api';
import { useApi } from 'ui/contexts/ApiContext';

type TxState = [
  SubmittableExtrinsic<'promise'> | null,
  OnInstantiateSuccess$Code | OnInstantiateSuccess$Hash,
  string | null
];

const initialData: InstantiateData = {
  constructorIndex: 0,
  value: BN_THOUSAND,
  name: '',
  weight: BN_THOUSAND,
};

const initialState = {
  data: initialData,
  currentStep: 1,
  tx: null,
  onError: NOOP,
  onSuccess: NOOP,
  onInstantiate: () => Promise.resolve(),
} as unknown as InstantiateState;

const InstantiateContext = React.createContext(initialState);

export function isResultValid({
  contract,
}: CodeSubmittableResult<'promise'> | BlueprintSubmittableResult<'promise'>): boolean {
  return !!contract;
}

export function InstantiateContextProvider({
  children,
}: React.PropsWithChildren<Partial<InstantiateProps>>) {
  const navigate = useNavigate();
  const dbState = useDatabase();
  const apiState = useApi();
  const NOOP = () => Promise.resolve();
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();
  const [currentStep, stepForward, stepBackward, setStep] = useStepper(initialState.currentStep);

  const [data, setData] = useState<InstantiateData>(initialState.data);
  const [[tx, onInstantiate], setTx] = useState<TxState>([null, NOOP, null]);
  const [dryRunResult, setDryRunResult] = useState<ContractInstantiateResult>();

  const onSuccess = useCallback(
    (contract: ContractPromise, _?: BlueprintPromise | undefined) => {
      navigate(`/contract/${contract.address}`);

      dbState.refreshUserData();
    },

    [dbState, navigate]
  );

  const onFinalize = (formData: Partial<InstantiateData>) => {
    const newData = { ...data, ...formData };
    try {
      const tx = createInstantiateTx(apiState.api, newData);

      const onInstantiate = (codeHashUrlParam ? onInsantiateFromHash : onInstantiateFromCode)(
        apiState,
        dbState,
        newData,
        onSuccess
      );
      setTx([tx, onInstantiate, null]);
      setData(newData);
      stepForward();
    } catch (e) {
      console.error(e);

      setTx([null, NOOP, 'Error creating transaction']);
    }
  };

  const onFormChange = useCallback(
    async (formData: Partial<InstantiateData>) => {
      const newData = { ...data, ...formData };

      try {
        const params = {
          origin: newData.accountId,
          gasLimit: newData.weight,
          storageDepositLimit: newData.storageDepositLimit,
          code: codeHashUrlParam
            ? { Existing: codeHashUrlParam }
            : { Upload: newData.metadata?.info.source.wasm },
          data: newData.argValues,
          value: newData.value,
        };

        console.log(newData.storageDepositLimit?.toString());

        if (params.origin) {
          const result = await apiState.api.rpc.contracts.instantiate(params);

          setDryRunResult(result);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [apiState.api.rpc.contracts, codeHashUrlParam, data]
  );

  console.log(dryRunResult?.storageDeposit.asCharge.toString());

  function onUnFinalize() {
    setTx([null, NOOP, null]);
    setStep(2);
  }

  const value: InstantiateState = {
    data,
    setData,
    currentStep,
    dryRunResult,
    setStep,
    stepForward,
    stepBackward,
    onSuccess,
    onUnFinalize,
    onFinalize,
    onFormChange,
    tx,
    onInstantiate,
    onError: NOOP,
  };

  return <InstantiateContext.Provider value={value}>{children}</InstantiateContext.Provider>;
}

export const useInstantiate = () => useContext(InstantiateContext);
