// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
// import { isHex } from '@polkadot/util';
import { randomAsHex } from '@polkadot/util-crypto';
import { Button, Buttons } from '../common/Button';
import { Form, FormField, getValidation } from '../form/FormField';
import { InputBalance } from '../form/InputBalance';
import { InputSalt } from '../form/InputSalt';
import { InputGas } from '../form/InputGas';
import { InputStorageDepositLimit } from '../form/InputStorageDepositLimit';
import { useAccountSelect } from '../form';
import { ArgumentForm } from 'ui/components/form/ArgumentForm';
import { Dropdown } from 'ui/components/common/Dropdown';
import { createConstructorOptions } from 'api/util';
import { useInstantiate } from 'ui/contexts';
import { useBalance } from 'ui/hooks/useBalance';
import { useArgValues } from 'ui/hooks/useArgValues';
import { useFormField } from 'ui/hooks/useFormField';
import { useWeight } from 'ui/hooks/useWeight';
import { useToggle } from 'ui/hooks/useToggle';

import type { AbiMessage } from 'types';
import { useStorageDepositLimit } from 'ui/hooks/useStorageDepositLimit';

export function Step2() {
  const {
    data: { metadata },
    stepBackward,
    currentStep,
    onFinalize,
  } = useInstantiate();

  const { accountId, AccountSelectField } = useAccountSelect();

  const {
    value: endowment,
    onChange: onChangeEndowment,
    ...endowmentValidation
  } = useBalance(10000);

  const weight = useWeight();
  const storageDepositLimit = useStorageDepositLimit(accountId);

  const salt = useFormField<string>(
    randomAsHex()
    // value => {
    //   if (!!value && isHex(value) && value.length === 66) {
    //     return { isValid: true };
    //   }

    //   return { isValid: false, isError: true, message: 'Invalid hex string' };
    // }
  );

  const [constructorIndex, setConstructorIndex] = useState<number>(0);
  const [deployConstructor, setDeployConstructor] = useState<AbiMessage>();

  const [argValues, setArgValues, setArgs] = useArgValues([]);

  useEffect(() => {
    setConstructorIndex(0);
    metadata && setDeployConstructor(metadata.constructors[0]);
  }, [metadata, setConstructorIndex]);

  useEffect(() => {
    deployConstructor && setArgs(deployConstructor.args);
  }, [deployConstructor, setArgs]);

  const [isUsingSalt, toggleIsUsingSalt] = useToggle();

  const submitHandler = () => {
    onFinalize &&
      onFinalize({
        accountId,
        constructorIndex,
        salt: salt.value,
        endowment,
        argValues,
        storageDepositLimit: storageDepositLimit.value || undefined,
        weight: weight.weight,
      });
  };

  if (currentStep !== 2) return null;

  return metadata ? (
    <>
      <Form>
        <AccountSelectField />
        <FormField id="constructor" label="Deployment Constructor">
          <Dropdown
            id="constructor"
            options={createConstructorOptions(metadata.constructors)}
            className="mb-4"
            value={constructorIndex}
            onChange={v => {
              setConstructorIndex(v);
              setDeployConstructor(metadata.constructors[v]);
              setArgs(metadata.constructors[v].args);
            }}
          >
            No constructors found
          </Dropdown>
          {deployConstructor && argValues && (
            <ArgumentForm
              key={`args-${deployConstructor.method}`}
              args={deployConstructor.args}
              setArgValues={setArgValues}
              argValues={argValues}
            />
          )}
        </FormField>
        <FormField id="endowment" label="Endowment" {...endowmentValidation}>
          <InputBalance id="endowment" value={endowment} onChange={onChangeEndowment} />
        </FormField>
        <FormField id="salt" label="Deployment Salt" {...getValidation(salt)}>
          <InputSalt isActive={isUsingSalt} toggleIsActive={toggleIsUsingSalt} {...salt} />
        </FormField>
        <FormField
          id="maxGas"
          label="Max Gas Allowed"
          isError={!weight.isValid}
          message={!weight.isValid ? 'Invalid gas limit' : null}
        >
          <InputGas isCall {...weight} />
        </FormField>
        <FormField
          id="storageDepositLimit"
          label="Storage Deposit Limit"
          isError={!storageDepositLimit.isValid}
          message={
            !storageDepositLimit.isValid
              ? storageDepositLimit.message || 'Invalid storage deposit limit'
              : null
          }
        >
          <InputStorageDepositLimit {...storageDepositLimit} />
        </FormField>
      </Form>
      <Buttons>
        <Button
          isDisabled={
            !endowmentValidation.isValid ||
            (isUsingSalt && !salt.isValid) ||
            !weight.isValid ||
            !storageDepositLimit.isValid ||
            !deployConstructor?.method ||
            !argValues
          }
          onClick={submitHandler}
          variant="primary"
        >
          Next
        </Button>

        <Button onClick={stepBackward} variant="default">
          Go Back
        </Button>
      </Buttons>
    </>
  ) : null;
}
