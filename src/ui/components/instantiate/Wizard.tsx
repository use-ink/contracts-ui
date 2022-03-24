// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { DryRun } from './DryRun';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Stepper } from './Stepper';
import { useInstantiate } from 'ui/contexts';

const steps = (t: TFunction<'translation', undefined>) => [
  { name: ['instantiateStep1', t('contractBundle', 'Contract Bundle')], index: 1 },
  { name: ['instantiateStep2', t('deploymentInfo', 'Deployment Info')], index: 2 },
  { name: ['instantiateStep3', t('confirmation', 'Confirmation')], index: 3 },
];

export function Wizard() {
  const { t } = useTranslation();
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
      <aside className="md:col-span-3 md:pt-0 p-4">
        <Stepper
          steps={steps(t).map(step => ({
            ...step,
            name: t(step.name[0], step.name[1]),
          }))}
        />
        {currentStep > 1 && <DryRun />}
      </aside>
    </div>
  );
}
