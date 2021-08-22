import React, { useReducer, Reducer } from 'react';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { useCanvas } from 'ui/contexts';
import { instantiateWithHash } from 'canvas/instantiate';
import type { InstantiateState, InstantiateAction } from 'types';

const initialState: InstantiateState = {
  isLoading: false,
  isSuccess: false,
  contract: null,
  currentStep: 1,
  contractName: '',
};

const reducer: Reducer<InstantiateState, InstantiateAction> = (state, action) => {
  switch (action.type) {
    case 'STEP_1_COMPLETE':
      return {
        ...state,
        codeHash: action.payload.codeHash,
        metadata: action.payload.metadata,
        contractName: action.payload.contractName,
        currentStep: 2,
      };
    case 'STEP_2_COMPLETE':
      return {
        ...state,
        fromAddress: action.payload.fromAddress,
        fromAccountName: action.payload.fromAccountName,
        contractName: action.payload.contractName,
        currentStep: 3,
      };
    case 'STEP_3_COMPLETE':
      return {
        ...state,
        constructorName: action.payload.constructorName,
        argValues: action.payload.argValues,
        currentStep: 4,
      };
    case 'GO_TO':
      return { ...state, currentStep: action.payload.step };
    case 'INSTANTIATE':
      return { ...state, isLoading: true };
    case 'INSTANTIATE_SUCCESS':
      return { ...state, isSuccess: true, contract: action.payload, isLoading: false };
    case 'INSTANTIATE_ERROR':
      return { ...state, isLoading: false };

    default:
      throw new Error();
  }
};

export const InstantiateWizard = () => {
  const { api, keyring } = useCanvas();
  const [state, dispatch] = useReducer(reducer, initialState);

  const keyringPairs = keyring?.getPairs();

  if (state.isLoading) {
    return (
      <>
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        <div> creating instance...</div>
      </>
    );
  }

  return keyringPairs && api?.query ? (
    <div className="">
      <Step1 dispatch={dispatch} currentStep={state.currentStep} />
      <Step2
        keyringPairs={keyringPairs}
        dispatch={dispatch}
        contractName={state.contractName}
        currentStep={state.currentStep}
      />
      <Step3
        constructors={state.metadata?.constructors}
        dispatch={dispatch}
        currentStep={state.currentStep}
      />
      <Step4
        state={state}
        dispatch={dispatch}
        currentStep={state.currentStep}
        submitHandler={instantiateWithHash}
      />
    </div>
  ) : null;
};
