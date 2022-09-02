// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useState, useContext, useCallback } from 'react';
import { useParams } from 'react-router';
import { ContractInstantiateResult } from '@polkadot/types/interfaces';
import { transformUserInput, maximumBlockWeight } from 'helpers';
import {
  InstantiateProps,
  InstantiateState,
  CodeSubmittableResult,
  BlueprintSubmittableResult,
  InstantiateData,
  Step2FormData,
  ApiPromise,
} from 'types';

const InstantiateContext = createContext<InstantiateState | undefined>(undefined);

export function isResultValid({
  contract,
}: CodeSubmittableResult<'promise'> | BlueprintSubmittableResult<'promise'>): boolean {
  return !!contract;
}

export function InstantiateContextProvider({
  children,
}: React.PropsWithChildren<Partial<InstantiateProps>>) {
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [data, setData] = useState<InstantiateData>({} as InstantiateData);
  const [dryRunResult, setDryRunResult] = useState<ContractInstantiateResult>();

  const onFinalize = (formData: Partial<InstantiateData>) => {
    const newData = { ...data, ...formData };
    try {
      setData(newData);
      setStep(3);
    } catch (e) {
      console.error(e);
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
    setStep(2);
  }

  const value: InstantiateState = {
    data,
    setData,
    step,
    dryRunResult,
    setStep,
    onUnFinalize,
    onFinalize,
    onFormChange,
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
