// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useState, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ContractInstantiateResult } from '@polkadot/types/interfaces';
import {
  onInsantiateSuccess,
  createInstantiateTx,
  transformUserInput,
  maximumBlockWeight,
} from 'helpers';
import {
  InstantiateProps,
  InstantiateState,
  CodeSubmittableResult,
  BlueprintSubmittableResult,
  InstantiateData,
  ContractPromise,
  BlueprintPromise,
  SubmittableExtrinsic,
  Step2FormData,
  ApiPromise,
} from 'types';
import { useStepper } from 'ui/hooks/useStepper';
import { useDatabase } from 'ui/contexts/DatabaseContext';

type TxState =
  | [SubmittableExtrinsic<'promise'>, ReturnType<typeof onInsantiateSuccess>]
  | undefined;

const InstantiateContext = createContext<InstantiateState | undefined>(undefined);

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
  const NOOP = () => Promise.resolve();
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();
  const [currentStep, stepForward, stepBackward, setStep] = useStepper(1);

  const [data, setData] = useState<InstantiateData>({} as InstantiateData);
  const [txState, setTx] = useState<TxState>();
  const [dryRunResult, setDryRunResult] = useState<ContractInstantiateResult>();

  const onSuccess = useCallback(
    (contract: ContractPromise, _?: BlueprintPromise) => {
      navigate(`/contract/${contract.address}`);
    },

    [navigate]
  );

  const onFinalize = (formData: Partial<InstantiateData>, api: ApiPromise) => {
    const newData = { ...data, ...formData };
    try {
      const tx = createInstantiateTx(api, newData);

      const cb = onInsantiateSuccess(dbState, newData, onSuccess);
      setTx([tx, cb]);
      setData(newData);
      stepForward();
    } catch (e) {
      console.error(e);

      setTx(undefined);
    }
  };

  const onFormChange = useCallback(
    async (formData: Step2FormData, api: ApiPromise) => {
      try {
        const constructor = data.metadata?.findConstructor(formData.constructorIndex);

        const inputData = constructor?.toU8a(
          transformUserInput(api.registry, constructor.args, formData.argValues)
        );

        const params = {
          origin: data.accountId,
          gasLimit: formData.weight || maximumBlockWeight(api),
          storageDepositLimit: formData.storageDepositLimit,
          code: codeHashUrlParam
            ? { Existing: codeHashUrlParam }
            : { Upload: data.metadata?.info.source.wasm },
          data: inputData,
          salt: formData.salt || undefined,
          value: formData.value ? api.registry.createType('Balance', formData.value) : null,
        };

        if (params.origin) {
          const result = await api.rpc.contracts.instantiate(params);

          setDryRunResult(result);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [codeHashUrlParam, data.accountId, data.metadata]
  );

  function onUnFinalize() {
    setTx(undefined);
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
    tx: txState && txState[0],
    onInstantiate: txState && txState[1],
    onError: NOOP,
  };

  return <InstantiateContext.Provider value={value}>{children}</InstantiateContext.Provider>;
}

export const useInstantiate = () => {
  const context = useContext(InstantiateContext);
  if (context === undefined) {
    throw new Error('useInstantiate must be used within an InstantiateProvider');
  }
  return context;
};
