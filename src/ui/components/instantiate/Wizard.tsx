// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DryRun } from './DryRun';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Stepper } from './Stepper';
import { useInstantiate } from 'ui/contexts';

const steps = [
  { name: 'Contract Bundle', index: 1 },
  { name: 'Deployment Info', index: 2 },
  { name: 'Confirmation', index: 3 },
];

export function Wizard() {
  const {
    currentStep,
    data: { metadata },
  } = useInstantiate();

  return (
    <div className="flex w-full m-1">
      <main className="xs:w-full md:flex-1 p-4 md:mr-2">
        <Step1 />
        {metadata && <Step2 />}
        <Step3 />
      </main>
      <aside className="xs:w-full md:w-80">
        <Stepper steps={steps} />
        {currentStep > 1 && <DryRun />}
      </aside>
    </div>
  );
}
