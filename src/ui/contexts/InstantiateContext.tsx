// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useContext, useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import { BN_THOUSAND } from '@polkadot/util';
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
  endowment: BN_THOUSAND,
  name: '',
  weight: BN_THOUSAND,
};
const initialState: InstantiateState = {
  data: initialData,
  currentStep: 1,
  tx: null,
  onError: NOOP,
  onSuccess: NOOP,
  onInstantiate: () => Promise.resolve(),
};
const InstantiateContext = React.createContext(initialState);

export function isResultValid({
  contract,
}: CodeSubmittableResult<'promise'> | BlueprintSubmittableResult<'promise'>): boolean {
  return !!contract;
}

export function InstantiateContextProvider({
  children,
}: React.PropsWithChildren<Partial<InstantiateProps>>) {
  const history = useHistory();
  const dbState = useDatabase();
  const apiState = useApi();
  const NOOP = () => Promise.resolve();
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();
  const [currentStep, stepForward, stepBackward, setStep] = useStepper(initialState.currentStep);

  const [data, setData] = useState<InstantiateData>(initialState.data);
  const [[tx, onInstantiate], setTx] = useState<TxState>([null, NOOP, null]);

  const onSuccess = useCallback(
    (contract: ContractPromise, _?: BlueprintPromise | undefined) => {
      history.push(`/contract/${contract.address}`);

      dbState.refreshUserData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dbState.refreshUserData]
  );

  const onFinalize = (formData: Partial<InstantiateData>) => {
    const newData = { ...data, ...formData };
    try {
      const tx = createInstantiateTx(apiState.api, newData);

      const onInstantiate = (codeHashUrlParam ? onInsantiateFromHash : onInstantiateFromCode)(
        apiState,
        dbState,
        data,
        onSuccess
      );
      setTx([tx, onInstantiate, null]);
      setData(newData);
      stepForward();
    } catch (e) {
      console.log(e);

      setTx([null, NOOP, 'Error creating transaction']);
    }
  };

  function onUnFinalize() {
    setTx([null, NOOP, null]);
    setStep(2);
  }

  const value: InstantiateState = {
    data,
    setData,
    currentStep,
    setStep,
    stepForward,
    stepBackward,
    onSuccess,
    onUnFinalize,
    onFinalize,
    tx,
    onInstantiate,
    onError: NOOP,
  };

  return <InstantiateContext.Provider value={value}>{children}</InstantiateContext.Provider>;
}

export const useInstantiate = () => useContext(InstantiateContext);
