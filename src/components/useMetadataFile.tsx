import { CheckIcon } from '@heroicons/react/solid';
import React, { useState, ChangeEvent } from 'react';
import { Abi, AnyJson } from '../types';
import { convertMetadata } from '../canvas';
import { useCanvas } from '../contexts';

function useMetadataFile(): [Abi | undefined, () => JSX.Element] {
  const [metadata, setMetadata] = useState<Abi>();
  const { api } = useCanvas();

  function handleUploadMetadata(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.item(0);
    const fr = new FileReader();

    fr.onload = function (e) {
      const result = JSON.parse(`${e.target?.result}`) as AnyJson;
      const converted = convertMetadata(result, api);
      setMetadata(converted);
    };
    if (file) fr.readAsText(file);
  }
  type Props = React.HTMLAttributes<HTMLInputElement>;

  const MetadataFileInput = ({ className }: Props) => {
    return metadata ? (
      <div className={`${className || ''} flex`}>
        <CheckIcon className="w-5 h-5 mr-2 text-green-500 " aria-hidden="true" />
        <span className="text-xs">
          {`${metadata.project.contract.name} - version ${metadata.project.contract.version} - by ${metadata.project.contract.authors}`}
        </span>
      </div>
    ) : (
      <div className={className || ''}>
        <label
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 border border-gray-700 rounded"
          htmlFor="file"
        >
          Upload metadata.json
        </label>
        <input
          type="file"
          id="file"
          style={{ display: 'none' }}
          onChange={handleUploadMetadata}
          accept="application/JSON"
        />
      </div>
    );
  };

  return [metadata, MetadataFileInput] as [Abi | undefined, () => JSX.Element];
}

export default useMetadataFile;
