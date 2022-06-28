// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { MessageSignature } from './MessageSignature';
import type { AbiConstructor, AbiMessage, Registry } from 'types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  message: AbiMessage | AbiConstructor;
  registry: Registry;
}

export const MessageDocs = ({ message, message: { docs }, registry }: Props) => {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className="collapsible-panel">
          <Disclosure.Button className="panel-title text-xs leading-normal text-left p-3 dark:bg-elevation-1 text-mono flex w-full">
            <ChevronUpIcon
              className={`${open ? 'transform rotate-180' : ''} w-5 h-5 mr-1 border-gray-500`}
            />
            <MessageSignature message={message} registry={registry} />
          </Disclosure.Button>
          <Disclosure.Panel className="panel-body p-4 markdown border-t dark:border-gray-700 border-gray-200">
            {/* eslint-disable-next-line react/no-children-prop */}
            {docs.length ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{docs.join('\r\n')}</ReactMarkdown>
            ) : (
              <i>No documentation provided</i>
            )}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};
