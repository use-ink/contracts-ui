import React from 'react';
import { StepInfo, StepsProgress } from './StepsProgress';
// import { resolveReducer } from './Reducers';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
// import { instantiateWithCode, instantiateWithHash } from 'canvas';
import { useInstantiate } from 'ui/contexts';
// import { Abi, InstantiateState, InstantiationTypeEnum } from 'types';
// import { useParams } from 'react-router';
// import { useCodeBundle } from 'ui/hooks';

// const initialState: InstantiateState = {
//   isLoading: false,
//   isSuccess: false,
//   contract: null,
//   currentStep: 1,
//   contractName: '',
// };

const stepsInfo: StepInfo[] = [
  {
    label: 'Contract Name',
    step: 0,
  },
  {
    label: 'Deployment Info',
    step: 1,
  },
  {
    label: 'Confirmation',
    step: 2,
  },
];

// interface Props {
//   codeHash?: string;
// }

export function Wizard () {
  const { step: [step] } = useInstantiate();

  return (
    <>
      <main className="md:col-span-9 p-4">
        {step === 0 && <Step1 />}
        {step === 1 && <Step2 />}
        {step === 2 && <Step3 />}
      </main>
      <aside className="md:col-span-3 md:pt-0 p-4">
        <StepsProgress currentStep={step} stepsInfo={stepsInfo} />
      </aside>
    </>
  )
};
