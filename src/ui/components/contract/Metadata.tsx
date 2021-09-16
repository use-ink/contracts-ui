import React from 'react';
import { MessageDocs } from './MessageDocs';
import { Abi } from 'types';

interface Props {
  isActive: boolean;
  abi: Abi;
}
export const MetadataTab = ({ isActive, abi: { constructors, messages } }: Props) => {
  if (!isActive) return null;

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-6 lg:col-span-7 2xl:col-span-8 rounded-lg w-full">
        {constructors.concat(messages).map(({ identifier, docs, isConstructor, args }) => (
          <MessageDocs
            key={identifier}
            title={identifier}
            docs={docs}
            isConstructor={isConstructor}
            args={args}
          />
        ))}
      </div>
    </div>
  );
};
