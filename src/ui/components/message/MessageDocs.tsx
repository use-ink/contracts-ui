// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { MessageSignature } from './MessageSignature';
import type { AbiConstructor, AbiMessage } from 'types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  message: AbiMessage | AbiConstructor;
}

export const MessageDocs = ({ message, message: { docs } }: Props) => {
  const { t } = useTranslation();

  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className="collapsible-panel">
          <Disclosure.Button className="panel-title text-xs leading-normal text-left p-3 dark:bg-elevation-1 text-mono flex w-full">
            <ChevronUpIcon
              className={`${open ? 'transform rotate-180' : ''} w-5 h-5 mr-1 border-gray-500`}
            />
            <MessageSignature message={message} />
          </Disclosure.Button>
          <Disclosure.Panel className="panel-body p-4 markdown border-t dark:border-gray-700 border-gray-200">
            {/* eslint-disable-next-line react/no-children-prop */}
            {docs.length ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{docs.join('\r\n')}</ReactMarkdown>
            ) : (
              <i>{t('noDocumentationProvided', 'No documentation provided')}</i>
            )}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};
