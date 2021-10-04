import React from 'react';
import { Button, Buttons } from '../Button';
import { Form, FormField, getValidation } from '../FormField';
import { InputFile } from 'ui/components/InputFile';
import { Input } from 'ui/components/Input';
import { useInstantiate } from 'ui/contexts';
import { truncate } from 'ui/util';

export function Step1() {
  const {
    codeHash,
    name,
    metadata,
    metadataFile: [metadataFile],
    step: [, stepForward],
  } = useInstantiate();

  return (
    <>
      <Form>
        <FormField id="name" label="Contract Name" {...getValidation(name)}>
          <Input id="contractName" placeholder="Give your contract a descriptive name" {...name} />
        </FormField>
        {!codeHash ? (
          <FormField id="metadata" label="Upload Contract Bundle" {...getValidation(metadata)}>
            <InputFile
              placeholder="Click to select or drag & drop to upload file."
              onChange={metadata.onChange}
              onRemove={metadata.onRemove}
              isError={metadata.isError}
              value={metadataFile}
            />
          </FormField>
        ) : (
          <FormField id="metadata" label="On-Chain Code">
            <div className="dark:bg-elevation-1 dark:border-gray-700 border p-4 rounded">
              <div className="dark:text-white mb-1">{metadata.value?.project.contract.name}</div>
              {codeHash && (
                <div className="dark:text-gray-500 text-sm">Code hash: {truncate(codeHash)}</div>
              )}
            </div>
          </FormField>
        )}
      </Form>
      <Buttons>
        <Button
          isDisabled={(!codeHash && !metadata.value) || !name.isValid || metadata.isError}
          onClick={stepForward}
          variant="primary"
        >
          Next
        </Button>
      </Buttons>
    </>
  );
}
