import React, { useReducer } from 'react';
import { StepInfo, StepsLabels } from '../StepsLabels';
import { resolveReducer } from './Reducers';
import {
  Step1 as HashStep1,
  Step2 as HashStep2,
  Step3 as HashStep3,
  Step4 as HashStep4,
} from './HashSteps';
import { Step1 as CodeStep1, Step2 as CodeStep2, Step3 as CodeStep3 } from './CodeSteps';
import { instantiateWithCode, instantiateWithHash } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { InstantiateState, InstantiationTypeEnum } from 'types';

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
      {instatiationType === InstantiationTypeEnum.HASH ? (
        <>
          <main className="md:col-span-9 p-4">
            <HashStep1 dispatch={dispatch} currentStep={state.currentStep} />
            <HashStep2
              keyringPairs={keyringPairs}
              dispatch={dispatch}
              contractName={state.contractName}
              currentStep={state.currentStep}
            />
            <HashStep3
              constructors={state.metadata?.constructors}
              dispatch={dispatch}
              currentStep={state.currentStep}
            />
            <HashStep4
              state={state}
              dispatch={dispatch}
              currentStep={state.currentStep}
              submitHandler={instantiateWithHash}
            />
          </main>
        </>
      ) : (
        <>
          <main className="md:col-span-9 p-4">
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
          </main>

          <aside className="md:col-span-3 md:pt-0 p-4">
            <StepsLabels currentStep={state.currentStep} stepsInfo={stepsInfo} />
          </aside>
        </>
      )}
    </>
  ) : null;
};
