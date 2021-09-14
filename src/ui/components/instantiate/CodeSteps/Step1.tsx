import React, { useState, ChangeEvent, useEffect } from 'react';
import { stringify, u8aToString } from '@polkadot/util';
import { FileInput } from 'ui/components/FileInput';
import { Input } from 'ui/components/Input';
import { AccountSelector } from 'ui/components/AccountSelector';
import {
  Abi,
  AnyJson,
  ApiPromise,
  DropdownOption,
  FileState,
  InstantiateAction,
  KeyringPair,
} from 'types';
import { convertMetadata, convertToUint8Array, createOptions, NOOP } from 'canvas/util';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  keyringPairs: Partial<KeyringPair>[];
  dispatch: React.Dispatch<InstantiateAction>;
  api: ApiPromise;
  currentStep?: number;
}

export const Step1 = ({ keyringPairs, dispatch, api, currentStep }: Props) => {
  const [accountSelected, setAccountSelected] = useState<DropdownOption>();
  const [contractName, setContractName] = useState('');
  const [file, setFile] = useState<FileState | null>();
  const [metadata, setMetadata] = useState<Abi>();
  const [codeHash, setCodeHash] = useState<string>();

  function handleUploadContract(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.item(0);
    const name = file?.name || '';
    const reader = new FileReader();
    reader.onabort = NOOP;
    reader.onerror = NOOP;

    setContractName(name.replace('.contract', '').replace('.json', '').replace('_', ' '));

    reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
      if (target && target.result) {
        const data = convertToUint8Array(target?.result as ArrayBuffer);
        const abi = convertMetadata(u8aToString(data) as AnyJson, api);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const codeHash = JSON.parse(stringify(abi?.json));
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setCodeHash(codeHash?.source?.hash);

        setMetadata(abi);
        setFile({ data, name: name, size: data.length } as FileState);
      }
    };

    if (file) reader.readAsArrayBuffer(file);
  }

  useEffect(() => {
    keyringPairs && setAccountSelected(createOptions(keyringPairs, 'pair')[0]);
  }, []);

  if (currentStep !== 1) return null;

  return (
    <>
      <label
        htmlFor="selectAccount"
        className="inline-block mb-2 dark:text-gray-300 text-gray-700 text-sm"
      >
        Account
      </label>

      <AccountSelector
        keyringPairs={keyringPairs}
        selectedOption={accountSelected}
        changeHandler={(o: DropdownOption) => setAccountSelected(o)}
        className="mb-2"
      />

      <label
        htmlFor="contractName"
        className="inline-block mb-2 dark:text-gray-300 text-gray-700 text-sm"
      >
        Contract Name
      </label>
      <Input
        value={contractName}
        handleChange={e => setContractName(e.target.value)}
        placeholder="Give your contract a descriptive name"
        id="contractName"
      />

      <label
        htmlFor="metadata"
        className="inline-block mb-2 dark:text-gray-300 text-gray-700 text-sm"
      >
        Upload Contract Bundle
      </label>
      <FileInput
        placeholder="Click to select or drag & drop to upload file."
        changeHandler={handleUploadContract}
        removeHandler={() => setFile(undefined)}
        fileLoaded={!!file}
        acceptAllFiles={true}
        successText={`${metadata?.project.contract.name}.contract`}
      />

      <button
        type="button"
        className="btn-primary"
        disabled={false}
        onClick={() => {
          metadata &&
            dispatch({
              type: 'UPLOAD_CONTRACT',
              payload: {
                codeHash: codeHash as string,
                file: file as FileState,
                metadata,
                fromAccountName: accountSelected?.name.toString() || '',
                fromAddress: accountSelected?.value.toString() || '',
                contractName: contractName,
              },
            });
        }}
      >
        Next
      </button>
    </>
  );
};
