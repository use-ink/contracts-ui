import React, { useReducer } from 'react';
import { StepInfo, StepsProgress } from './StepsProgress';
import { resolveReducer } from './Reducers';
import { Step1 as HashStep1, Step2 as HashStep2, Step3 as HashStep3 } from './HashSteps';
import { Step1 as CodeStep1, Step2 as CodeStep2, Step3 as CodeStep3 } from './CodeSteps';
import { instantiateWithCode, instantiateWithHash } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { Abi, InstantiateState, InstantiationTypeEnum } from 'types';

const initialState: InstantiateState = {
  isLoading: false,
  isSuccess: false,
  contract: null,
  currentStep: 1,
  contractName: '',
};

const stepsInfo: StepInfo[] = [
  {
    label: 'Contract Name',
    step: 1,
  },
  {
    label: 'Deployment Info',
    step: 2,
  },
  {
    label: 'Confirmation',
    step: 3,
  },
];

interface Props {
  instatiationType: string;
}

export const Wizard = ({ instatiationType }: Props) => {
  const { api, keyring } = useCanvas();
  const keyringPairs = keyring?.getPairs();
  const [state, dispatch] = useReducer(resolveReducer(instatiationType), initialState);

  if (state.isLoading) {
    return (
      <>
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        <div> creating instance...</div>
      </>
    );
  }

  return keyringPairs && api?.query ? (
    <>
      <main className="md:col-span-9 p-4">
        {instatiationType === InstantiationTypeEnum.HASH ? (
          <>
            <HashStep1
              dispatch={dispatch}
              currentStep={state.currentStep}
              keyringPairs={keyringPairs}
              api={api}
            />
            <HashStep2
              constructors={state.metadata?.constructors}
              dispatch={dispatch}
              currentStep={state.currentStep}
            />
            <HashStep3
              state={state}
              dispatch={dispatch}
              currentStep={state.currentStep}
              submitHandler={instantiateWithHash}
            />
          </>
        ) : (
          <>
            <CodeStep1
              keyringPairs={keyringPairs}
              dispatch={dispatch}
              api={api}
              currentStep={state.currentStep}
            />
            <CodeStep2
              metadata={state.metadata as Abi}
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
          </>
        )}
      </main>
      <aside className="md:col-span-3 md:pt-0 p-4">
        <StepsProgress currentStep={state.currentStep} stepsInfo={stepsInfo} />
      </aside>
    </>
  ) : null;
};
