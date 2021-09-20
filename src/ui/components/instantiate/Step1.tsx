import React from 'react';
// import { stringify, u8aToString } from '@polkadot/util';
import { AccountSelect } from '../AccountSelect';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { InputFile } from 'ui/components/InputFile';
import { Input } from 'ui/components/Input';
// import {
//   FileState,
// } from 'types';
// import { convertToUint8Array, NOOP } from 'canvas/util';
import { useInstantiate } from 'ui/contexts';


// interface Props extends React.HTMLAttributes<HTMLInputElement> {
//   keyringPairs: Partial<KeyringPair>[];
//   dispatch: React.Dispatch<InstantiateAction>;
//   api: ApiPromise;
//   currentStep?: number;
// }

export function Step1 () {
  const {
    accountId: [accountId, setAccountId, isAccountIdValid, isAccountIdError],
    name: [name, setName, isNameValid, isNameError],
    metadata: {
      isError: isMetadataError,
      value: metadata,
      onChange: onMetadataChange,
      onRemove: onMetadataRemove,
    },
    metadataFile: [metadataFile],
    step: [step, setStep]
  } = useInstantiate();

  // const onChange = useCallback(
  //   (data: Uint8Array, newName: string) => {
  //     metadata.onChange(data, newName);
  //     if (metadata.name && (!name || name === '')) {
  //       setName(metadata.name);
  //     }
  //   },
  //   [metadata.onChange, name]
  // );

  // function handleUploadContract(event: ChangeEvent<HTMLInputElement>) {
  //   const file = event.target.files?.item(0);
  //   const reader = new FileReader();
  //   reader.onabort = NOOP;
  //   reader.onerror = NOOP;

  //   setName(file?.name ? file.name.replace('.contract', '').replace('.json', '').replace('_', ' ') : 'New Contract');

  //   reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
  //     if (target && target.result) {
  //       const data = convertToUint8Array(target?.result as ArrayBuffer);
  //       // const abi = convertMetadata(u8aToString(data) as AnyJson, api);

  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //       // const codeHash = JSON.parse(stringify(abi?.json));
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //       // setCodeHash(codeHash?.source?.hash);

  //       metadata.onChange(data, name);
  //       setFile({ data, name: name, size: data.length } as FileState);
  //     }
  //   };

  //   if (file) reader.readAsArrayBuffer(file);
  // }

  function goForward () {
    setStep(step + 1);
  }

  return (
    <>
      <label
        htmlFor="selectAccount"
        className="inline-block mb-2 dark:text-gray-300 text-gray-700 text-sm"
      >
        Account
      </label>
      <AccountSelect
        isError={isAccountIdError}
        value={accountId}
        onChange={setAccountId}
        className="mb-2"
      />
      <label
        htmlFor="contractName"
        className="inline-block mb-2 dark:text-gray-300 text-gray-700 text-sm"
      >
        Contract Name
      </label>
      <Input
        isError={isNameError}
        value={name}
        onChange={setName}
        placeholder="Give your contract a descriptive name"
        id="contractName"
      />

      <label
        htmlFor="metadata"
        className="inline-block mb-2 dark:text-gray-300 text-gray-700 text-sm"
      >
        Upload Contract Bundle
      </label>
      <InputFile
        placeholder="Click to select or drag & drop to upload file."
        onChange={onMetadataChange}
        onRemove={onMetadataRemove}
        isError={isMetadataError}
        successMessage={metadataFile?.name}
        value={metadataFile}
      />
      <Buttons>
        <Button
          isDisabled={!metadata || !isAccountIdValid || !isNameValid || isMetadataError}
          onClick={goForward}
          variant='primary'
        >
          Next
        </Button>
      </Buttons>
    </>
  );
};
