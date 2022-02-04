// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

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
  const { currentStep } = useInstantiate();

  return (
    <div className="grid md:grid-cols-12 gap-5 m-1">
      <main className="md:col-span-9 p-4">
        <Step1 />
        <Step2 />
        <Step3 />
      </main>
      <aside className="md:col-span-3 md:pt-0 p-4">
        <Stepper steps={steps} />
        {currentStep > 0 && <DryRun />}
      </aside>
    </div>
  );
}
