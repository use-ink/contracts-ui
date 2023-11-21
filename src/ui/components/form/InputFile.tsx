// Copyright 2023 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DocumentTextIcon } from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import { useCallback } from 'react';
import Dropzone from 'react-dropzone';
import { fileToFileState } from 'lib/fileToFileState';
import type { InputFileProps as Props } from 'types';

export function InputFile({
  className = '',
  errorMessage,
  isError,
  onChange,
  onRemove,
  placeholder,
  value: file,
}: Props) {
  const onDrop = useCallback(
    (droppedFiles: File[]): void => {
      // should only be one files as we set multiple={false} on <Dropzone/>
      droppedFiles.forEach((droppedFile): void => {
        fileToFileState(droppedFile)
          .then(fileState => {
            onChange && onChange(fileState);
          })
          .catch(e => console.error(e));
      });
    },
    [onChange],
  );

  const removeHandler = useCallback((): void => {
    onRemove && onRemove();
  }, [onRemove]);

  return file ? (
    <div className={`${className} flex`} data-cy="upload-confirmation">
      <div className="inline-flex items-center rounded border border-gray-300 p-6 shadow dark:border-gray-700 dark:bg-elevation-1">
        <DocumentTextIcon
          aria-hidden="true"
          className="mr-2 h-7 w-7 justify-self-start text-gray-500"
        />

        <span className="min-w-600 mr-20 justify-self-start text-xs text-gray-500 dark:text-gray-300">
          {file.name} ({(file.size / 1000).toFixed(2)}kb)
        </span>

        {errorMessage && isError && (
          <span className="min-w-600 mr-20 justify-self-start text-xs text-gray-500 dark:text-gray-300">
            {errorMessage}
          </span>
        )}
        <XIcon
          aria-hidden="true"
          className="mr-2 h-5 w-5 cursor-pointer justify-self-end text-gray-500"
          onClick={removeHandler}
        />
      </div>
    </div>
  ) : (
    <Dropzone multiple={false} onDrop={onDrop}>
      {({ getInputProps, getRootProps }) => {
        return (
          <div className={className} {...getRootProps()}>
            <label
              className="flex h-36 cursor-pointer flex-col items-center justify-center rounded border border-gray-200 px-4 py-2 font-normal text-gray-400 dark:border-gray-700 dark:text-gray-700"
              htmlFor="file"
            >
              <svg
                className="mb-2 h-8 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <span className="text-sm text-gray-400 dark:text-gray-500">{placeholder}</span>
            </label>
            <input {...getInputProps()} data-cy="file-input" />
          </div>
        );
      }}
    </Dropzone>
  );
}
