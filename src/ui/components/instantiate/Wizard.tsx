import React from 'react';
import { FormField, getValidation } from '../FormField';
import { AccountSelect } from '../AccountSelect';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Stepper } from './Stepper';
import { CONTRACT_FILE, DEPLOYMENT_INFO, FINALIZE, useInstantiate } from 'ui/contexts';

const steps = ['Contract Bundle', 'Deployment Info', 'Confirmation'];

export function Wizard() {
  const {
    accountId,
    step: [step],
  } = useInstantiate();

  return (
    <>
      <main className="md:col-span-9 p-4">
        {step < 2 && (
          <FormField className="mb-8" id="accountId" label="Account" {...getValidation(accountId)}>
            <AccountSelect id="accountId" className="mb-2" {...accountId} />
          </FormField>
        )}
        {step === CONTRACT_FILE && <Step1 />}
        {step === DEPLOYMENT_INFO && <Step2 />}
        {step === FINALIZE && <Step3 />}
      </main>
      <aside className="md:col-span-3 md:pt-0 p-4">
        <Stepper step={step} steps={steps} />
      </aside>
    </>
  );
}
