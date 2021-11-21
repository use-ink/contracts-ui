// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useContext } from 'react';
// import { useHistory, useParams } from 'react-router';

import { BN_THOUSAND } from '@polkadot/util';
// import { useApi } from './ApiContext';
// import { useDatabase } from './DatabaseContext';
// import { createInstantiateTx, onInsantiateFromHash, onInstantiateFromCode } from 'api/instantiate';
import {
  // BlueprintPromise,
  // ContractPromise,
  InstantiateProps,
  InstantiateState,
  // SubmittableExtrinsic,
  // OnInstantiateSuccess$Code,
  // OnInstantiateSuccess$Hash,
  CodeSubmittableResult,
  BlueprintSubmittableResult,
  InstantiateData,
} from 'types';

import { useStepper } from 'ui/hooks/useStepper';

// type TxState = [
//   SubmittableExtrinsic<'promise'> | null,
//   OnInstantiateSuccess$Code | OnInstantiateSuccess$Hash,
//   string | null
// ];

// const NOOP = () => Promise.resolve();

export const CONTRACT_FILE = 0;
export const DEPLOYMENT_INFO = 1;
export const FINALIZE = 2;

export function isResultValid({
  contract,
}: CodeSubmittableResult<'promise'> | BlueprintSubmittableResult<'promise'>): boolean {
  return !!contract;
}
const initialFormState: InstantiateData = {
  constructorIndex: 0,
  argValues: undefined,
  endowment: BN_THOUSAND,
  name: '',
  weight: BN_THOUSAND,
};
const initialState: InstantiateState = {
  data: initialFormState,
  currentStep: 0,
};

export const InstantiateContext = React.createContext(initialState);

export function InstantiateContextProvider({
  children,
}: React.PropsWithChildren<Partial<InstantiateProps>>) {
  // const history = useHistory();
  // const { codeHash } = useParams<{ codeHash: string }>();
  // const apiState = useApi();
  // const dbState = useDatabase();
  const [currentStep, stepForward, stepBackward] = useStepper();
  // const [, , , setStep] = step;

  const [data, setData] = useState<InstantiateData>(initialFormState);
  // const [[tx, , txError], setTx] = useState<TxState>([null, NOOP, null]);

  // const onSuccess = useCallback(
  //   (contract: ContractPromise, _?: BlueprintPromise | undefined) => {
  //     history.push(`/contract/${contract.address}`);

  //     dbState.refreshUserData();
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [dbState.refreshUserData]
  // );

  // function onFinalize() {
  //   try {
  //     const tx = createInstantiateTx(apiState.api, data);

  //     const onInstantiate = (codeHash ? onInsantiateFromHash : onInstantiateFromCode)(
  //       apiState,
  //       dbState,
  //       data
  //     );

  //     setTx([tx, onInstantiate, null]);
  //     setStep(FINALIZE);
  //   } catch (e) {
  //     setTx([null, NOOP, 'Error creating transaction']);
  //   }
  // }

  // function onUnFinalize() {
  //   setTx([null, NOOP, null]);
  //   setStep(DEPLOYMENT_INFO);
  // }

  const value: InstantiateState = {
    data,
    setData,
    currentStep,
    stepForward,
    stepBackward,
  };

  return <InstantiateContext.Provider value={value}>{children}</InstantiateContext.Provider>;
}

export const useInstantiate = () => useContext(InstantiateContext);
