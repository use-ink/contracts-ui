import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import { DocumentTextIcon, UploadIcon } from '@heroicons/react/outline';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  fileLoaded?: boolean;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeHandler: () => void;
  successText?: string;
}

export const FileInput = ({
  className = '',
  fileLoaded,
  changeHandler,
  removeHandler,
  placeholder,
  successText = 'File uploaded!',
}: Props) => {
  return fileLoaded ? (
    <div className={`${className} flex`}>
      <div className="px-4 py-6 border dark:border-gray-700 border-gray-300 dark:bg-elevation-1 inline-flex items-center rounded">
        <DocumentTextIcon
          className="w-5 h-5 mr-2 text-gray-500 justify-self-start"
          aria-hidden="true"
        />
        <span className="dark:text-gray-300 text-gray-500 text-sm min-w-600 justify-self-start mr-20">
          {successText}
        </span>
        <XIcon
          className="w-5 h-5 text-gray-500 hover:text-gray-300 justify-self-end cursor-pointer"
          aria-hidden="true"
          onClick={removeHandler}
        />
      </div>
    </div>
  ) : (
    <div className={className}>
      <label
        className="dark:text-gray-700 text-gray-400 font-bold py-6 px-4 space-y-2 border dark:border-gray-700 border-gray-200 rounded flex flex-col items-center cursor-pointer justify-center"
        htmlFor="file"
      >
        <UploadIcon className="h-10 dark:text-gray-500" />
        <span className="text-sm font-normal dark:text-gray-500 text-gray-400">{placeholder}</span>
      </label>
      <input
        type="file"
        id="file"
        style={{ display: 'none' }}
        onChange={changeHandler}
        accept="application/JSON"
      />
    </div>
  );
};
