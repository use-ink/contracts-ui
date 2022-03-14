import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { Disclosure } from '@headlessui/react';
import { MessageSignature } from '../message/MessageSignature';
import { Spinner } from '../common/Spinner';
import type { CallResult } from 'types';

interface Props {
  result: CallResult;
  date: string;
}

export const TransactionResult = ({
  result: { isComplete, time, message, blockHash, info, error, log },
  date,
}: Props) => {
  return (
    <Disclosure>
      {({ open }) => (
        <div
          key={`${time}`}
          className="text-xs dark:text-gray-400 text-gray-600 break-all p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="flex-col">
            <div className="mb-2">{date}</div>
            <MessageSignature message={message} />
            {!isComplete && <Spinner width={4} strokeWidth={2} color="gray-600" className="mt-2" />}
            {isComplete && (
              <>
                <Disclosure.Button className="flex items-center w-full text-left pt-2">
                  <div className="flex-col items-start">
                    <div className="event-log">
                      {log.map((line, index) => (
                        <p key={index} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } w-4 h-4 ml-auto border-gray-500 `}
                  />
                </Disclosure.Button>
                <Disclosure.Panel>
                  {error && (
                    <ReactMarkdown
                      // eslint-disable-next-line react/no-children-prop
                      children={error.docs.join('\r\n')}
                      remarkPlugins={[remarkGfm]}
                      className="markdown mt-4 mb-4"
                    />
                  )}
                  <div className="pt-4 mb-4">
                    <span className="mr-2">Included at #</span>
                    <span className="text-mono p-1 dark:bg-elevation-1 bg-gray-200">
                      {`${blockHash?.slice(0, 6)}...${blockHash?.slice(-4)}`}
                    </span>
                  </div>
                  <div>
                    <span className="mr-2">Weight</span>
                    <span className="text-mono p-1 dark:bg-elevation-1 bg-gray-200">{`${info?.weight}`}</span>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </div>
        </div>
      )}
    </Disclosure>
  );
};
