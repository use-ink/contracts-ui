// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { classes, getContractInfo, isValidAddress } from 'helpers';
import {
  Button,
  Buttons,
  FormField,
  getValidation,
  Input,
  InputFile,
  useMetadataField,
} from 'ui/components';
import { Page } from 'ui/templates';
import { useApi, useDatabase } from 'ui/contexts';
import { useNonEmptyString } from 'ui/hooks/useNonEmptyString';

export function AddressLookup() {
  const [searchString, setSearchString] = useState('');
  const [address, setAddress] = useState('');
  const { api } = useApi();
  const navigate = useNavigate();

  const {
    file,
    value: metadata,
    isLoading,
    isStored,
    onChange,
    onRemove,
    ...metadataValidation
  } = useMetadataField();

  const { value: name, onChange: setName, ...nameValidation } = useNonEmptyString();

  const { db } = useDatabase();

  useEffect((): void => {
    async function validate() {
      if (address !== searchString) {
        if (isValidAddress(searchString)) {
          const isOnChain = await getContractInfo(api, searchString);
          if (isOnChain) {
            const contract = await db.contracts.get({ address: searchString });
            contract ? navigate(`/contract/${searchString}`) : setAddress(searchString);
          } else {
            setAddress('');
          }
        } else {
          setAddress('');
        }
      }
    }
    validate().catch(e => console.error(e));
  }, [api, address, searchString, db.contracts, navigate]);
  return (
    <Page
      header="Add contract from address"
      help={<>Add metadata to an existing contract instance in order to interact with it.</>}
    >
      <FormField
        help="The address of the contract you want to interact with"
        id="address"
        label="Contract Address"
      >
        {' '}
        <Input
          className={classes('relative flex items-center mb-4')}
          onChange={setSearchString}
          placeholder="Paste an on-chain contract address"
          value={searchString}
        >
          {address ? (
            <CheckCircleIcon className="w-5 h-5 text-green-500 -ml-8" aria-hidden="true" />
          ) : (
            searchString && (
              <XCircleIcon className="w-5 h-5 text-red-500 -ml-8" aria-hidden="true" />
            )
          )}
        </Input>
      </FormField>

      {address && (
        <>
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
          <FormField
            help={
              'The contract metadata JSON file to use in order to interact with this contract. Constructor and message information will be derived from this file.'
            }
            id="metadata"
            label={'Upload Metadata'}
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
          <Buttons>
            <Button
              isDisabled={!metadata || !nameValidation.isValid || !metadataValidation.isValid}
              onClick={async () => {
                if (!metadata) return;
                const document = {
                  abi: metadata.json,
                  address,
                  codeHash: metadata.info.source.wasmHash.toHex(),
                  date: new Date().toISOString(),
                  name,
                };
                await db.contracts.add(document);
                navigate(`/contract/${address}`);
              }}
              variant="primary"
              data-cy="next-btn"
            >
              Next
            </Button>
          </Buttons>
        </>
      )}
    </Page>
  );
}
