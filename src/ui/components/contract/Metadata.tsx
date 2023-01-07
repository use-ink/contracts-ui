// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Abi } from 'types';
import { MessageDocs } from 'ui/components/message/MessageDocs';
import { Button } from 'ui/components/common';
import { FormField, getValidation, InputFile, useMetadataField } from 'ui/components/form';
import { useApi, useDatabase } from 'ui/contexts';

export const MetadataTab = () => {
  const { db } = useDatabase();
  const { api } = useApi();
  const { address } = useParams();
  const [abi, setAbi] = useState<Abi>();

  const document = useLiveQuery(() => {
    return db.contracts.get({ address });
  });

  const {
    file,
    value: metadata,
    isLoading,
    isStored,
    onChange,
    onRemove,
    isSupplied,
    isValid,
    ...metadataValidation
  } = useMetadataField();

  useEffect(() => {
    if (!document) return;
    const newAbi = new Abi(document?.abi, api?.registry.getChainProperties());
    setAbi(newAbi);
  }, [api?.registry, document]);

  if (!abi) return null;

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-6 lg:col-span-7 2xl:col-span-8 rounded-lg w-full">
        <div className="mb-10" data-cy="contract-docs">
          {abi.constructors.concat(abi.messages).map(message => (
            <MessageDocs key={message.identifier} message={message} registry={abi.registry} />
          ))}
        </div>
        <FormField
          help={
            'Change the metadata associated with this contract. Useful for upgradable contracts.'
          }
          id="metadata"
          label={'Update Metadata'}
          {...getValidation(metadataValidation)}
          className="pb-5"
        >
          <InputFile
            placeholder="Click to select or drag and drop to upload file."
            onChange={onChange}
            onRemove={onRemove}
            isError={metadataValidation.isError}
            value={file}
            className="mb-5"
          />
        </FormField>
        <Button
          className="flex justify-between items-center px-3 py-2 border text-gray-500 dark:text-gray-300 dark:border-gray-700 border-gray-200 rounded-md dark:bg-elevation-1 dark:enabled:hover:bg-elevation-2"
          isDisabled={!isSupplied || !isValid}
          onClick={async () => {
            if (!metadata || !document?.id) throw new Error('Unable to update metadata.');
            await db.contracts.update(document.id, { abi: metadata.json });
            onRemove();
          }}
        >
          Update metadata
        </Button>
      </div>
    </div>
  );
};
