import React from 'react';
import { UploadIcon, DocumentIcon, XIcon } from '@heroicons/react/solid';

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
      <div className="p-6 border dark:border-gray-700 border-gray-300 inline-flex items-center rounded">
        <DocumentIcon
          className="w-5 h-5 mr-2 text-green-500 justify-self-start"
          aria-hidden="true"
        />
        <span className="dark:text-gray-300 text-gray-500 text-xs min-w-600 justify-self-start mr-20">
          {successText}
        </span>
        <XIcon
          className="w-5 h-5 mr-2 text-green-500 justify-self-end cursor-pointer"
          aria-hidden="true"
          onClick={removeHandler}
        />
      </div>
    </div>
  ) : (
    <div className={className}>
      <label
        className="dark:text-gray-700 text-gray-500 font-bold py-2 px-4 border dark:border-gray-700 border-gray-300 rounded flex flex-col h-36 items-center cursor-pointer justify-center"
        htmlFor="file"
      >
        <UploadIcon className="h-10 dark:text-gray-500" />
        <span className="dark:text-gray-500">{placeholder}</span>
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
