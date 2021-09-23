import React from 'react';
import { AccountSelect } from '../AccountSelect';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { FormField, getValidation } from '../FormField';
import { InputFile } from 'ui/components/InputFile';
import { Input } from 'ui/components/Input';
import { useInstantiate } from 'ui/contexts';

export function Step1 () {
  const {
    accountId,
    isUsingStoredMetadata: [isUsingStoredMetadata],
    name,
    metadata,
    metadataFile: [metadataFile],
    step: [, stepForward]
  } = useInstantiate();
  
  return (
    <>
      <FormField
        id="accountId"
        label="Account"
        {...getValidation(accountId)}
      >
        <AccountSelect
          id="accountId"
          className="mb-2"
          {...accountId}
        />
      </FormField>
      <FormField
        id="name"
        label="Contract Name"
        {...getValidation(name)}
      >
        <Input
          id="contractName"
          placeholder="Give your contract a descriptive name"
          {...name}
        />
      </FormField>
      <FormField
        id="metadata"
        label="Upload Contract Bundle"
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
      <Buttons>
        <Button
          isDisabled={(!isUsingStoredMetadata && !metadata.value) || !accountId.isValid || !name.isValid || metadata.isError}
          onClick={stepForward}
          variant='primary'
        >
          Next
        </Button>
      </Buttons>
    </>
  );
};
