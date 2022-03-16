// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
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
    data: { metadata },
  } = useInstantiate();
  return (
    <div className="grid md:grid-cols-12 gap-5 m-1">
      <main className="md:col-span-9 p-4">
        <Step1 />
        {metadata && <Step2 />}
        <Step3 />
      </main>
      <aside className="md:col-span-3 md:pt-0 p-4">
        <Stepper steps={steps} />
      </aside>
    </div>
  );
}
