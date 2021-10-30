import React from 'react';
import { Button, Buttons } from '../Button';
import { Form, FormField, getValidation } from '../FormField';
import { CodeHash } from '../CodeHash';
import { InputFile } from 'ui/components/InputFile';
import { Input } from 'ui/components/Input';
import { useInstantiate } from 'ui/contexts';

export function Step1 () {
  const {
    codeHash,
    name,
    isUsingStoredMetadata,
    metadata,
    metadataFile: [metadataFile],
    step: [, stepForward]
  } = useInstantiate();
  
  return (
    <>
      <Form>
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
        {codeHash && (
          <FormField
            id="metadata"
            label="On-Chain Code"
          >
            <CodeHash
              codeHash={codeHash}
              name={isUsingStoredMetadata ? metadata.value?.info.contract.name.toString() : 'Unidentified Code'}
            />
          </FormField>
        )}
        {(!codeHash || !isUsingStoredMetadata) && (
          <FormField
            id="metadata"
            label={codeHash ? "Upload Metadata" : "Upload Contract Bundle"}
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
          isDisabled={!metadata.value || !name.isValid || metadata.isError}
          onClick={stepForward}
          variant='primary'
        >
          Next
        </Button>
      </Buttons>
    </>
  );
};
