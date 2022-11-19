// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Button, Buttons } from '../common/Button';
import { Form, FormField, getValidation } from '../form/FormField';
import { InputSalt } from '../form/InputSalt';
import { OptionsForm } from '../form';
import { isNumber, genRanHex, transformUserInput, BN_ZERO } from 'helpers';
import { ArgumentForm } from 'ui/components/form/ArgumentForm';
import { Dropdown } from 'ui/components/common/Dropdown';
import { createConstructorOptions } from 'ui/util/dropdown';
import { useApi, useInstantiate } from 'ui/contexts';
import { useBalance } from 'ui/hooks/useBalance';
import { useArgValues } from 'ui/hooks/useArgValues';
import { useFormField } from 'ui/hooks/useFormField';
import { useWeight } from 'ui/hooks/useWeight';
import { useToggle } from 'ui/hooks/useToggle';
import { AbiMessage, OrFalsy } from 'types';
import { useStorageDepositLimit } from 'ui/hooks/useStorageDepositLimit';

function validateSalt(value: OrFalsy<string>) {
  if (!!value && value.length === 66) {
    return { isValid: true };
  }

  return { isValid: false, isError: true, message: 'Invalid hex string' };
}

export function Step2() {
  const { api } = useApi();
  const { data, setStep, step, setData, dryRunResult, setDryRunResult } = useInstantiate();
  const { accountId, metadata } = data;
  const [constructorIndex, setConstructorIndex] = useState<number>(0);
  const [deployConstructor, setDeployConstructor] = useState<AbiMessage>();
  const valueState = useBalance(BN_ZERO);
  const { value } = valueState;
  const refTime = useWeight(dryRunResult?.gasRequired.refTime.toBn());
  const proofSize = useWeight(dryRunResult?.gasRequired.proofSize.toBn());
  const storageDepositLimit = useStorageDepositLimit(accountId);
  const salt = useFormField<string>(genRanHex(64), validateSalt);
  const [argValues, setArgValues] = useArgValues(deployConstructor?.args ?? [], metadata?.registry);
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();

  useEffect(() => {
    setConstructorIndex(0);
    metadata && setDeployConstructor(metadata.constructors[0]);
  }, [metadata, setConstructorIndex]);

  const [isUsingSalt, toggleIsUsingSalt] = useToggle(true);

  const params = useMemo(() => {
    const inputData = deployConstructor?.toU8a(
      transformUserInput(api.registry, deployConstructor.args, argValues)
    );
    return {
      origin: accountId,
      value: deployConstructor?.isPayable ? value : BN_ZERO,
      gasLimit:
        refTime.mode === 'custom' || proofSize.mode === 'custom'
          ? api.registry.createType('WeightV2', {
              refTime: refTime.limit,
              proofSize: proofSize.limit,
            })
          : null,
      storageDepositLimit: storageDepositLimit.isActive ? storageDepositLimit.value : undefined,
      code: codeHashUrlParam
        ? { Existing: codeHashUrlParam }
        : { Upload: metadata?.info.source.wasm },
      data: inputData,
      salt: isUsingSalt ? salt.value : undefined,
    };
  }, [
    deployConstructor,
    api.registry,
    argValues,
    accountId,
    value,
    refTime.mode,
    refTime.limit,
    proofSize.mode,
    proofSize.limit,
    storageDepositLimit.isActive,
    storageDepositLimit.value,
    codeHashUrlParam,
    metadata?.info.source.wasm,
    isUsingSalt,
    salt.value,
  ]);

  useEffect((): void => {
    async function dryRun() {
      try {
        const result = await api.call.contractsApi.instantiate(
          params.origin,
          params.value ?? 0,
          params.gasLimit,
          params.storageDepositLimit ?? null,
          params.code,
          params.data ?? '',
          params.salt ?? ''
        );

        if (JSON.stringify(dryRunResult) !== JSON.stringify(result)) {
          setDryRunResult(result);
        }
      } catch (e) {
        console.error(e);
      }
    }
    dryRun().catch(e => console.error(e));
  }, [api.call.contractsApi, dryRunResult, params, setDryRunResult]);

  const onSubmit = () => {
    const { salt, value, gasLimit } = params;
    const { storageDeposit } = dryRunResult ?? {};
    setData({
      ...data,
      constructorIndex,
      salt,
      value,
      argValues,
      storageDepositLimit: storageDepositLimit.isActive
        ? storageDepositLimit.value
        : storageDeposit?.isCharge
        ? storageDeposit?.asCharge
        : undefined,
      gasLimit:
        refTime.mode === 'custom' || proofSize.mode === 'custom'
          ? gasLimit
          : dryRunResult?.gasRequired ?? null,
    });
    setStep(3);
  };

  if (step !== 2) return null;

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
        <FormField
          help="A hex or string value that acts as a salt for this deployment."
          id="salt"
          label="Deployment Salt"
          {...getValidation(salt)}
        >
          <InputSalt isActive={isUsingSalt} toggleIsActive={toggleIsUsingSalt} {...salt} />
        </FormField>
        <OptionsForm
          isPayable={!!deployConstructor?.isPayable}
          refTime={refTime}
          proofSize={proofSize}
          value={valueState}
          storageDepositLimit={storageDepositLimit}
        />
      </Form>
      <Buttons>
        <Button
          isDisabled={
            (deployConstructor?.isPayable && !valueState.isValid) ||
            !salt.isValid ||
            !refTime.isValid ||
            !proofSize.isValid ||
            !storageDepositLimit.isValid ||
            !deployConstructor?.method ||
            !!dryRunResult?.result.isErr ||
            !dryRunResult
          }
          onClick={onSubmit}
          variant="primary"
          data-cy="next-btn"
        >
          Next
        </Button>

        <Button
          onClick={() => {
            setStep(1);
          }}
          variant="default"
        >
          Go Back
        </Button>
      </Buttons>
    </>
  ) : null;
}
