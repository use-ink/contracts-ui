import React from 'react';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Stepper } from './Stepper';
import { useInstantiate } from 'ui/contexts';

const steps = [
  'Contract Bundle',
  'Deployment Info',
  'Confirmation'
];

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
        <Stepper step={step} steps={steps} />
      </aside>
    </>
  )
};
