// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Stepper } from './Stepper';
import { CONTRACT_FILE, DEPLOYMENT_INFO, FINALIZE, useInstantiate } from 'ui/contexts';

const steps = ['Contract Bundle', 'Deployment Info', 'Confirmation'];

export function Wizard() {
  const { currentStep } = useInstantiate();

  return (
    <div className="grid md:grid-cols-12 gap-5 m-1">
      <main className="md:col-span-9 p-4">
        {currentStep === CONTRACT_FILE && <Step1 />}
        {currentStep === DEPLOYMENT_INFO && <Step2 />}
        {currentStep === FINALIZE && <Step3 />}
      </main>
      <aside className="md:col-span-3 md:pt-0 p-4">
        <Stepper step={currentStep} steps={steps} />
      </aside>
    </div>
  );
}
