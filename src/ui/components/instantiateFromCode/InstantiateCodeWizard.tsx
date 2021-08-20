import React, { useReducer, Reducer } from 'react';
import { CodeStep1 } from './CodeStep1';
import { CodeStep2 } from './CodeStep2';
import { CodeStep3 } from './CodeStep3';
import { InstantiateState, InstantiateCodeAction } from 'types';
import { useCanvas } from 'ui/contexts';
import { instantiateWithCode } from 'canvas';

const initialState: InstantiateState = {
  isLoading: false,
  isSuccess: false,
  contract: null,
  currentStep: 1,
  contractName: '',
};

const reducer: Reducer<InstantiateState, InstantiateCodeAction> = (state, action) => {
  switch (action.type) {
    case 'STEP_1_COMPLETE':
      return {
        ...state,
        fromAccountName: action.payload.fromAccountName,
        fromAddress: action.payload.fromAddress,
        metadata: action.payload.metadata,
        contractName: action.payload.contractName,
        file: action.payload.file,
        currentStep: 2,
      };
    case 'STEP_2_COMPLETE':
      return {
        ...state,
        constructorName: action.payload.constructorName,
        argValues: action.payload.argValues,
        endowment: action.payload.endowment,
        salt: action.payload.salt,
        gas: action.payload.gas,
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

export const InstantiateCodeWizard = () => {
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
      <CodeStep1
        keyringPairs={keyringPairs}
        dispatch={dispatch}
        api={api}
        currentStep={state.currentStep}
      />
      <CodeStep2
        constructors={state.metadata?.constructors}
        dispatch={dispatch}
        currentStep={state.currentStep}
      />
      <CodeStep3
        state={state}
        dispatch={dispatch}
        api={api}
        currentStep={state.currentStep}
        submitHandler={instantiateWithCode}
      />
    </div>
  ) : null;
};
