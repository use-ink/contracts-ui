/* eslint-disable header/header */
// Copyright 2021 @paritytech/contracts-ui authors & contributors
// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createRef, useCallback, useEffect, useState } from 'react';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import { XIcon } from '@heroicons/react/solid';
import { DocumentTextIcon } from '@heroicons/react/outline';
import { hexToU8a, isHex, u8aToString } from '@polkadot/util';
import type { FileState, InputFileProps as Props, OrFalsy } from 'types';

const BYTE_STR_0 = '0'.charCodeAt(0);
const BYTE_STR_X = 'x'.charCodeAt(0);
const STR_NL = '\n';
const NOOP = (): void => undefined;

function convertResult(result: ArrayBuffer): Uint8Array {
  const data = new Uint8Array(result);

  // this converts the input (if detected as hex), via the hex conversion route
  if (data[0] === BYTE_STR_0 && data[1] === BYTE_STR_X) {
    let hex = u8aToString(data);

    while (hex[hex.length - 1] === STR_NL) {
      hex = hex.substr(0, hex.length - 1);
    }

    if (isHex(hex)) {
      return hexToU8a(hex);
    }
  }

  return data;
}

export function InputFile({
  className = '',
  errorMessage,
  value: propsFile,
  isError,
  onChange,
  placeholder,
  onRemove,
}: Props) {
  const ref = createRef<DropzoneRef>();
  const [file, setFile] = useState<OrFalsy<FileState>>(propsFile);

  const onDrop = useCallback(
    (files: File[]): void => {
      files.forEach((file): void => {
        const reader = new FileReader();

        reader.onabort = NOOP;
        reader.onerror = NOOP;

        reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
          if (target && target.result) {
            const name = file.name;
            const data = convertResult(target.result as ArrayBuffer);
            const size = data.length;

            onChange && onChange({ data, name, size });
            ref &&
              !propsFile &&
              setFile({
                data,
                name,
                size: data.length,
              });
          }
        };

        reader.readAsArrayBuffer(file);
      });
    },
    [ref, onChange, propsFile]
  );

  const removeHandler = useCallback((): void => {
    onRemove && onRemove();

    !propsFile && setFile(undefined);
  }, [onRemove, propsFile]);

  useEffect((): void => {
    if (file !== propsFile) {
      setFile(propsFile);
    }
  }, [file, propsFile]);

  return file ? (
    <div className={`${className} flex`} data-cy="upload-confirmation">
      <div className="p-6 border dark:bg-elevation-1 dark:border-gray-700 border-gray-300 inline-flex items-center rounded shadow">
        <DocumentTextIcon
          className="w-7 h-7 mr-2 text-gray-500 justify-self-start"
          aria-hidden="true"
        />
        <span className="dark:text-gray-300 text-gray-500 text-xs min-w-600 justify-self-start mr-20">
          {file.name} ({(file.size / 1000).toFixed(2)}kb)
        </span>
        {errorMessage && isError && (
          <span className="dark:text-gray-300 text-gray-500 text-xs min-w-600 justify-self-start mr-20">
            {errorMessage}
          </span>
        )}
        <XIcon
          className="w-5 h-5 mr-2 text-gray-500 justify-self-end cursor-pointer"
          aria-hidden="true"
          onClick={removeHandler}
        />
      </div>
    </div>
  ) : (
    <Dropzone multiple={false} onDrop={onDrop} ref={ref}>
      {({ getInputProps, getRootProps }) => {
        return (
          <div className={className} {...getRootProps()}>
            <label
              className="dark:text-gray-700 text-gray-400 font-normal py-2 px-4 border dark:border-gray-700 border-gray-200 rounded flex flex-col h-36 items-center cursor-pointer justify-center"
              htmlFor="file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 mb-2 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="text-sm dark:text-gray-500 text-gray-400">{placeholder}</span>
            </label>
            <input {...getInputProps()} data-cy="file-input" />
          </div>
        );
      }}
    </Dropzone>
  );
}
