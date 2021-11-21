// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { Button, Buttons } from '../common/Button';
import { Form, FormField, getValidation } from '../form/FormField';
import { Loader } from '../common/Loader';
import { AccountSelect } from '../account/AccountSelect';
import { CodeHash } from './CodeHash';
import { InputFile } from 'ui/components/form/InputFile';
import { Input } from 'ui/components/form/Input';
import { useInstantiate } from 'ui/contexts';
import { useNonEmptyString } from 'ui/hooks/useNonEmptyString';
import { useCodeBundle } from 'ui/hooks/useCodeBundle';
import { useMetadata } from 'ui/hooks/useMetadata';
import { useAccountId } from 'ui/hooks/useAccountId';

import { FileState } from 'types';

export function Step1() {
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();
  const history = useHistory();

  const { stepForward, setData, data, currentStep } = useInstantiate();

  const codeBundleQuery = useCodeBundle(codeHashUrlParam);
  const codeBundle = codeBundleQuery.data;

  const [metadataFile, setMetadataFile] = useState<FileState>();

  const isLoading = useMemo(
    () => !!codeHashUrlParam && codeBundleQuery.isLoading,
    [codeHashUrlParam, codeBundleQuery.isLoading]
  );

  const isUsingStoredMetadata = useMemo(
    (): boolean => !!codeBundle?.document,
    [codeBundle?.document]
  );

  const metadata = useMetadata(codeBundle?.document?.abi, {
    isWasmRequired: !codeBundle,
    onChange: setMetadataFile,
  });

  const { value: accountId, onChange: setAccountId, ...accountIdValidation } = useAccountId();

  const { value: name, onChange: setName, ...nameValidation } = useNonEmptyString();

  useEffect((): void => {
    if (metadata.value?.info.contract.name && !name) {
      setName(metadata.value?.info.contract.name.toString());
    }
  }, [metadata.value, name, setName]);

  useEffect((): void => {
    if (codeHashUrlParam && !codeBundleQuery.isValid) {
      history.replace('/instantiate/hash');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeHashUrlParam, codeBundleQuery.isValid]);

  function moveToNextStep() {
    setData &&
      setData({
        ...data,
        accountId,
        metadata: metadata?.value,
        name,
        codeHash: codeHashUrlParam || undefined,
      });

    stepForward && stepForward();
  }

  if (currentStep !== 1) return null;

  return (
    <Loader isLoading={isLoading}>
      <Form>
        <FormField className="mb-8" id="accountId" label="Account" {...accountIdValidation}>
          <AccountSelect
            id="accountId"
            className="mb-2"
            value={accountId}
            onChange={setAccountId}
          />
        </FormField>
        <FormField id="name" label="Contract Name" {...nameValidation}>
          <Input
            id="contractName"
            placeholder="Give your contract a descriptive name"
            value={name}
            onChange={setName}
          />
        </FormField>
        {codeHashUrlParam && (
          <FormField id="metadata" label="On-Chain Code">
            <CodeHash
              codeHash={codeHashUrlParam}
              name={
                isUsingStoredMetadata
                  ? metadata.value?.info.contract.name.toString()
                  : 'Unidentified Code'
              }
            />
          </FormField>
        )}
        {(!codeHashUrlParam || !isUsingStoredMetadata) && (
          <FormField
            id="metadata"
            label={codeHashUrlParam ? 'Upload Metadata' : 'Upload Contract Bundle'}
            {...getValidation(metadata)}
          >
            <InputFile
              placeholder="Click to select or drag & drop to upload file."
              onChange={metadata.onChange}
              onRemove={metadata.onRemove}
              isError={metadata.isError}
              value={metadataFile}
            />
          </FormField>
        )}
      </Form>
      <Buttons>
        <Button
          isDisabled={!metadata.value || !nameValidation.isValid || metadata.isError}
          onClick={moveToNextStep}
          variant="primary"
        >
          Next
        </Button>
      </Buttons>
    </Loader>
  );
}
