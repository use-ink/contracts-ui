import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { AbiParam } from 'types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  docs: string[];
  isConstructor?: boolean;
  args: AbiParam[];
}

export const MessageDocs = ({ title, docs, args, isConstructor }: Props) => {
  const text = docs.join('\r\n');
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className="collapsible-panel">
          <Disclosure.Button className="panel-title p-4 bg-elevation-1 text-mono flex w-full">
            <ChevronUpIcon
              className={`${open ? 'transform rotate-180' : ''} w-5 h-5 mr-1 border-gray-500`}
            />
            <span className={isConstructor ? 'text-blue-400' : 'text-yellow-400'}>{title}</span>(
            {args.map(({ name, type: { type } }, index) => (
              <span key={name} className="whitespace-pre">
                {`${name}: ${type}`}
                {index !== args.length - 1 && `, `}
              </span>
            ))}
            )
          </Disclosure.Button>
          <Disclosure.Panel className="panel-body p-4 markdown border-t border-gray-700">
            {/* eslint-disable-next-line react/no-children-prop */}
            <ReactMarkdown children={text} remarkPlugins={[remarkGfm]} />
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};
