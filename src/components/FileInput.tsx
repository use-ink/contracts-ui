import React from 'react';
import { UploadIcon, DocumentIcon, XIcon } from '@heroicons/react/solid';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  fileLoaded?: boolean;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  successText?:string
}

const FileInput = ({
  className = '',
  fileLoaded,
  changeHandler,
  placeholder,
  successText = "File uploaded!"
}: Props) => {
  return fileLoaded ? (
    <div className={`${className} flex`}>
      <div className="p-6 border border-gray-300 inline-flex items-center">
          <DocumentIcon
            className="w-5 h-5 mr-2 text-green-500 justify-self-start"
            aria-hidden="true"
          />
          <span className="text-xs min-w-600 justify-self-start mr-20">
            {successText}
          </span>
          <XIcon className="w-5 h-5 mr-2 text-green-500 justify-self-end" aria-hidden="true" />
        </div>
      </div>
  ) : (
    <div className={className}>
      <label
        className="text-gray-700 font-bold py-2 px-4 border border-gray-300 rounded flex flex-col h-36 items-center cursor-pointer justify-center"
        htmlFor="file"
      >
        <UploadIcon className="h-10" />
        {placeholder}
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

export default FileInput;
