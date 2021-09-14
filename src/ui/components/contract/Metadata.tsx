import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Abi, AbiParam } from 'types';

interface Props {
  isActive: boolean;
  abi: Abi;
}
interface Props2 extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  content: string[];
  isConstructor?: boolean;
  args: AbiParam[];
}

const CollapsiblePanel = ({ title, content, args, isConstructor }: Props2) => {
  const text = content.join('\r\n');
  return (
    <div className="collapsible-panel">
      <div className="panel-title border-b border-gray-700 p-4 bg-elevation-1 text-mono ">
        <span className={isConstructor ? 'text-blue-400' : 'text-yellow-400'}>{title}</span>(
        {args.map(({ name, type: { type } }) => (
          <span key={name}>{` ${name}: ${type} `}</span>
        ))}
        )
      </div>
      <div className="panel-body p-4 markdown">
        {/* eslint-disable-next-line react/no-children-prop */}
        <ReactMarkdown children={text} remarkPlugins={[remarkGfm]} />
      </div>
    </div>
  );
};
export const MetadataTab = ({ isActive, abi: { constructors, messages } }: Props) => {
  if (!isActive) return null;
  console.log(constructors, messages);

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-6 lg:col-span-7 2xl:col-span-8 rounded-lg w-full">
        {constructors.concat(messages).map(({ identifier, docs, isConstructor, args }) => (
          <CollapsiblePanel
            key={identifier}
            title={identifier}
            content={docs}
            isConstructor={isConstructor}
            args={args}
          />
        ))}
      </div>
    </div>
  );
};
