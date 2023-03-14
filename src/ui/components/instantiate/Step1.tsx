// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button, Buttons } from '../common/Button';
import { Input, InputFile, Form, FormField, useMetadataField, getValidation } from '../form';
import { Loader } from '../common/Loader';
import { AccountSelect } from '../account';
import { MessageDocs } from '../message';
import { CodeHash } from './CodeHash';
import { useNonEmptyString } from 'ui/hooks/useNonEmptyString';
import { useApi, useDatabase, useInstantiate } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';

export function Step1() {
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();
  const { db } = useDatabase();
  const [codeBundle] = useDbQuery(
    () => (codeHashUrlParam ? db.codeBundles.get({ codeHash: codeHashUrlParam }) : undefined),
    [codeHashUrlParam, db]
  );
  const { accounts } = useApi();
  const { setStep, setData, data, step } = useInstantiate();

  const [accountId, setAccountId] = useState('');
  const { value: name, onChange: setName, ...nameValidation } = useNonEmptyString();

  const {
    file,
    value: metadata,
    isLoading,
    isStored,
    onChange,
    onRemove,
    ...metadataValidation
  } = useMetadataField();

  useEffect((): void => {
    if (metadataValidation.name) {
      setName(metadataValidation.name);
    }
  }, [metadataValidation.name, setName]);

  useEffect((): void => {
    if (!accounts || accounts.length === 0) return;
    setAccountId(accounts[0].address);
  }, [accounts]);

  function submitStep1() {
    setData &&
      setData({
        ...data,
        accountId,
        metadata,
        name,
        codeHash: codeHashUrlParam,
      });

    setStep(2);
  }

  if (step !== 1) return null;

  return (
    <Loader isLoading={isLoading}>
      <Form>
        <FormField
          help="The account to use for this instantiation. The fees and storage deposit will be deducted from this account."
          id="accountId"
          label="Account"
        >
          <AccountSelect
            id="accountId"
            className="mb-2"
            value={accountId}
            onChange={setAccountId}
          />
        </FormField>
        <FormField
          help="A name for the new contract to help users distinguish it. Only used for display purposes."
          id="name"
          label="Contract Name"
          {...nameValidation}
        >
          <Input
            id="contractName"
            placeholder="Give your contract a descriptive name"
            value={name}
            onChange={setName}
          />
        </FormField>
        {codeHashUrlParam && codeBundle && (
          <FormField
            help="The on-chain code hash that will be reinstantiated as a new contract."
            id="metadata"
            label="On-Chain Code"
          >
            <CodeHash codeHash={codeHashUrlParam} name={codeBundle.name} />
          </FormField>
        )}
        {(!codeHashUrlParam || !isStored) && (
          <FormField
            help={
              codeHashUrlParam && !isStored
                ? 'The contract metadata JSON file to save for this contract. Constructor and message information will be derived from this file.'
                : 'The contract bundle file containing the WASM blob and metadata.'
            }
            id="metadata"
            label={codeHashUrlParam ? 'Upload Metadata' : 'Upload Contract Bundle'}
            {...getValidation(metadataValidation)}
          >
            <InputFile
              placeholder="Click to select or drag and drop to upload file."
              onChange={onChange}
              onRemove={onRemove}
              isError={metadataValidation.isError}
              value={file}
            />
          </FormField>
        )}
      </Form>

      {metadata && (
        <>
          <div>Metadata</div>

          <div className="flex flex-column">
            {/* <div>Hash:{metadata.info.contract.hash} </div> */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div>Language</div>
                <div>{metadata.info.source.language}</div>
              </div>
              <div>
                <div>Compiler</div>
                <div>{metadata.info.source.compiler}</div>
              </div>
              <div>
                <div>Version</div>
                <div>{metadata.info.contract.version}</div>
              </div>
              <div>
                <div>Authors</div>
                <div>{metadata.info.contract.authors}</div>
              </div>
            </div>
          </div>
          {metadata.constructors.concat(metadata.messages).map(message => (
            <MessageDocs
              defaultOpen={false}
              key={message.identifier}
              message={message}
              registry={metadata.registry}
            />
          ))}
        </>
      )}

      <Buttons>
        <Button
          isDisabled={!metadata || !nameValidation.isValid || !metadataValidation.isValid}
          onClick={submitStep1}
          variant="primary"
          data-cy="next-btn"
        >
          Next
        </Button>
      </Buttons>
    </Loader>
  );
}
