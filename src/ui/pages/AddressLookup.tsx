// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CheckCircleIcon } from '@heroicons/react/outline';
import { Abi } from '@polkadot/api-contract';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classes, isValidAddress } from 'lib/util';
import { getContractInfo } from 'services/chain';
import {
  Button,
  Buttons,
  Dropdown,
  FormField,
  Input,
  InputFile,
  getValidation,
  useMetadataField,
} from 'ui/components';
import { useApi, useDatabase, useVersion } from 'ui/contexts';
import { useNonEmptyString } from 'ui/hooks/useNonEmptyString';
import { useStoredMetadata } from 'ui/hooks/useStoredMetadata';
import { RootLayout } from 'ui/layout';

export function AddressLookup() {
  const [searchString, setSearchString] = useState('');
  const [address, setAddress] = useState('');
  const { api } = useApi();
  const navigate = useNavigate();
  const { version } = useVersion();

  const {
    file,
    value: fileMetadata,
    isLoading,
    isStored,
    onChange,
    onRemove,
    ...metadataValidation
  } = useMetadataField();

  const { value: name, onChange: setName, ...nameValidation } = useNonEmptyString('New Contract');

  const { db } = useDatabase();
  const [abis, isLoadingStoredAbis] = useStoredMetadata();
  const [knownMetadata, selectKnownMetadata] = useState<Abi | undefined>(undefined);
  const [metadata, setMetadata] = useState<Abi | undefined>(undefined);

  useEffect(() => {
    if (fileMetadata) {
      setMetadata(fileMetadata);
    } else if (knownMetadata) {
      setMetadata(knownMetadata);
    } else {
      setMetadata(undefined);
    }
  }, [fileMetadata, knownMetadata]);

  useEffect((): void => {
    async function validate() {
      if (address !== searchString) {
        if (isValidAddress(searchString, version)) {
          const isOnChain = await getContractInfo(api, searchString);
          if (isOnChain) {
            const contract = await db.contracts.get({ address: searchString });
            // Contract is already instantiated in current UI
            if (contract) {
              navigate(`/contract/${searchString}`);
            } else {
              if (abis) {
                const knownAbi = abis.find(
                  a => a.info.source.wasmHash.toHex() === isOnChain.codeHash.toHex(),
                );
                selectKnownMetadata(knownAbi);
              }
              setAddress(searchString);
            }
          } else {
            setAddress('');
          }
        } else {
          setAddress('');
        }
      }
    }
    validate().catch(e => console.error(e));
  }, [api, address, searchString, db.contracts, navigate, abis]);

  return (
    <RootLayout
      heading="Add contract from address"
      help={<>Add metadata to an existing contract instance in order to interact with it.</>}
    >
      <FormField
        className="relative"
        help="The address of the contract you want to interact with."
        id="address"
        isError={!!searchString && !address}
        label="Contract Address"
        message={
          isValidAddress(searchString, version)
            ? 'Address is not on-chain '
            : 'Address is not valid'
        }
      >
        <Input
          className={classes('relative mb-4 flex items-center')}
          onChange={setSearchString}
          placeholder="Paste an on-chain contract address"
          value={searchString}
        >
          {address && (
            <div className="absolute right-2 flex items-center text-green-500">
              <span className="w-22 mr-1 text-xs">on-chain</span>
              <CheckCircleIcon aria-hidden="true" className="h-4 w-4" />
            </div>
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
              onChange={setName}
              placeholder="Give your contract a descriptive name"
              value={name}
            />
          </FormField>

          {knownMetadata ? (
            <FormField
              help={'Reuse metadata you used before.'}
              id="known_metadata"
              label={'Known Metadata'}
            >
              {!isLoadingStoredAbis && abis && abis.length > 0 && (
                <Dropdown
                  className="mb-4"
                  id="known_metadata"
                  onChange={(abi: Abi | undefined) => {
                    selectKnownMetadata(abi);
                  }}
                  options={abis.map(abi => ({
                    label: `${abi.info.contract.name} - ${abi.info.source.wasmHash.toHex()}`,
                    value: abi,
                  }))}
                  value={knownMetadata}
                >
                  No Metadata found
                </Dropdown>
              )}
              <p
                className="mt-[-10px] cursor-pointer pl-1 text-sm text-green-500 underline hover:text-green-600"
                onClick={() => selectKnownMetadata(undefined)}
              >
                Use new metadata instead
              </p>
            </FormField>
          ) : (
            <FormField
              help={
                'The contract metadata JSON file to use in order to interact with this contract. Constructor and message information will be derived from this file.'
              }
              id="metadata"
              label={'Upload Metadata'}
              {...getValidation(metadataValidation)}
            >
              <InputFile
                isError={metadataValidation.isError}
                onChange={onChange}
                onRemove={onRemove}
                placeholder="Click to select or drag and drop to upload file."
                value={file}
              />
            </FormField>
          )}

          <Buttons>
            <Button
              data-cy="next-btn"
              isDisabled={
                !metadata ||
                !nameValidation.isValid ||
                (!!fileMetadata && !metadataValidation.isValid) ||
                !address
              }
              onClick={async () => {
                if (!metadata) return;
                const document = {
                  abi: metadata.json,
                  address,
                  codeHash: metadata.info.source.wasmHash.toHex(),
                  date: new Date().toISOString(),
                  name,
                  external: true,
                };
                await db.contracts.add(document);
                navigate(`/contract/${address}`);
              }}
              variant="primary"
            >
              Add contract
            </Button>
          </Buttons>
        </>
      )}
    </RootLayout>
  );
}
