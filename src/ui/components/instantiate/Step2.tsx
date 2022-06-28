// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { isHex, isNumber } from '@polkadot/util';
import { randomAsHex } from '@polkadot/util-crypto';
import { Button, Buttons } from '../common/Button';
import { Form, FormField, getValidation } from '../form/FormField';
import { InputBalance } from '../form/InputBalance';
import { InputSalt } from '../form/InputSalt';
import { InputGas } from '../form/InputGas';
import { InputStorageDepositLimit } from '../form/InputStorageDepositLimit';
import { ArgumentForm } from 'ui/components/form/ArgumentForm';
import { Dropdown } from 'ui/components/common/Dropdown';
import { createConstructorOptions } from 'ui/util/dropdown';
import { useInstantiate } from 'ui/contexts';
import { useBalance } from 'ui/hooks/useBalance';
import { useArgValues } from 'ui/hooks/useArgValues';
import { useFormField } from 'ui/hooks/useFormField';
import { useWeight } from 'ui/hooks/useWeight';
import { useToggle } from 'ui/hooks/useToggle';

import { AbiMessage, OrFalsy, Registry } from 'types';
import { useStorageDepositLimit } from 'ui/hooks/useStorageDepositLimit';
import { useDebounce } from 'ui/hooks';

export function Step2() {
  const {
    data: { accountId, metadata },
    dryRunResult,
    stepBackward,
    currentStep,
    onFinalize,
    onFormChange,
  } = useInstantiate();

  const { value, onChange: onChangeValue, ...valueValidation } = useBalance(10000);
  const dbValue = useDebounce(value);

  const [estimatedWeight, setEstimatedWeight] = useState<OrFalsy<BN>>(null);
  const weight = useWeight(estimatedWeight);
  const dbWeight = useDebounce(weight.weight);

  const storageDepositLimit = useStorageDepositLimit(accountId);
  const dbStorageDepositLimit = useDebounce(storageDepositLimit.value);

  const salt = useFormField<string>(randomAsHex(), value => {
    if (!!value && isHex(value) && value.length === 66) {
      return { isValid: true };
    }

    return { isValid: false, isError: true, message: 'Invalid hex string' };
  });
  const dbSalt = useDebounce(salt.value);

  const [constructorIndex, setConstructorIndex] = useState<number>(0);
  const [deployConstructor, setDeployConstructor] = useState<AbiMessage>();

  const [argValues, setArgValues] = useArgValues(
    metadata?.registry as Registry,
    deployConstructor?.args || null
  );
  const dbArgValues = useDebounce(argValues);

  useEffect(() => {
    setConstructorIndex(0);
    metadata && setDeployConstructor(metadata.constructors[0]);
  }, [metadata, setConstructorIndex]);

  const [isUsingSalt, toggleIsUsingSalt] = useToggle(true);
  const [isUsingStorageDepositLimit, toggleIsUsingStorageDepositLimit] = useToggle();

  const onSubmit = () => {
    onFinalize &&
      onFinalize({
        constructorIndex,
        salt: isUsingSalt ? salt.value : undefined,
        value,
        argValues,
        storageDepositLimit: isUsingStorageDepositLimit ? storageDepositLimit.value : undefined,
        weight: weight.isActive ? weight.weight : estimatedWeight || weight.defaultWeight,
      });
  };

  useEffect((): void => {
    if (
      dryRunResult?.result.isOk &&
      dryRunResult.gasRequired &&
      !estimatedWeight?.eq(dryRunResult.gasRequired)
    ) {
      setEstimatedWeight(dryRunResult.gasRequired);
    }
  }, [
    dryRunResult?.result.isOk,
    dryRunResult?.result.isErr,
    dryRunResult?.gasRequired,
    estimatedWeight,
  ]);

  useEffect((): void => {
    onFormChange &&
      onFormChange({
        constructorIndex,
        salt: isUsingSalt ? dbSalt : null,
        value: dbValue && deployConstructor?.isPayable ? dbValue : null,
        argValues: dbArgValues,
        storageDepositLimit: isUsingStorageDepositLimit ? dbStorageDepositLimit : null,
        weight: weight.isActive ? dbWeight : weight.defaultWeight,
      });
  }, [
    onFormChange,
    constructorIndex,
    deployConstructor,
    dbSalt,
    dbValue,
    dbArgValues,
    dbStorageDepositLimit,
    dbWeight,
    isUsingSalt,
    isUsingStorageDepositLimit,
    weight.defaultWeight,
    weight.isActive,
  ]);

  useEffect(
    (): void => {
      if (!metadata) {
        setEstimatedWeight(null);
        weight.setIsActive(false);
      }
    },
    // eslint-disable-next-line
    [metadata]
  );

  if (currentStep !== 2) return null;

  return metadata ? (
    <>
      <Form>
        <FormField
          help="The constructor to use for this contract deployment."
          id="constructor"
          label="Deployment Constructor"
        >
          <Dropdown
            id="constructor"
            options={createConstructorOptions(metadata.registry, metadata.constructors)}
            className="mb-4"
            value={constructorIndex}
            onChange={v => {
              if (isNumber(v)) {
                setConstructorIndex(v);
                setDeployConstructor(metadata.constructors[v]);
              }
            }}
          >
            No constructors found
          </Dropdown>
          {deployConstructor && argValues && (
            <ArgumentForm
              key={`args-${deployConstructor.method}`}
              args={deployConstructor.args}
              registry={metadata.registry}
              setArgValues={setArgValues}
              argValues={argValues}
              className="argument-form"
            />
          )}
        </FormField>
        {deployConstructor?.isPayable && (
          <FormField
            help="The balance to transfer from the `origin` to the newly created contract."
            id="value"
            label="Value"
            {...valueValidation}
          >
            <InputBalance id="value" value={value} onChange={onChangeValue} />
          </FormField>
        )}
        <FormField
          help="A hex or string value that acts as a salt for this deployment."
          id="salt"
          label="Deployment Salt"
          {...getValidation(salt)}
        >
          <InputSalt isActive={isUsingSalt} toggleIsActive={toggleIsUsingSalt} {...salt} />
        </FormField>
        <FormField
          help="The maximum amount of gas (in millions of units) to use for this instantiation. If the transaction requires more, it will fail."
          id="maxGas"
          label="Max Gas Allowed"
          isError={!weight.isValid}
          message={!weight.isValid ? 'Invalid gas limit' : null}
        >
          <InputGas isCall withEstimate {...weight} />
        </FormField>
        <FormField
          help="The maximum balance allowed to be deducted for the new contract's storage deposit."
          id="storageDepositLimit"
          label="Storage Deposit Limit"
          isError={!storageDepositLimit.isValid}
          message={
            !storageDepositLimit.isValid
              ? storageDepositLimit.message || 'Invalid storage deposit limit'
              : null
          }
        >
          <InputStorageDepositLimit
            isActive={isUsingStorageDepositLimit}
            toggleIsActive={toggleIsUsingStorageDepositLimit}
            {...storageDepositLimit}
          />
        </FormField>
      </Form>
      <Buttons>
        <Button
          isDisabled={
            (deployConstructor?.isPayable && !valueValidation.isValid) ||
            (isUsingSalt && !salt.isValid) ||
            !weight.isValid ||
            !storageDepositLimit.isValid ||
            !deployConstructor?.method ||
            !argValues ||
            (dryRunResult && dryRunResult.result.isErr)
          }
          onClick={onSubmit}
          variant="primary"
          data-cy="next-btn"
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
