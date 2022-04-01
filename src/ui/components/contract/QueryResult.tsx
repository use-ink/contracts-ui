// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { isBn } from '@polkadot/util';
import { encodeTypeDef } from '@polkadot/types';
import { MessageSignature } from '../message/MessageSignature';
import { CallResult } from 'types';
import { useApi } from 'ui/contexts';
import { fromSats } from 'api';

interface Props {
  result: CallResult;
  date: string;
}

export const QueryResult = ({ result: { time, data, message, error }, date }: Props) => {
  const { api } = useApi();

  return (
    <div
      key={`${time}`}
      className={
        'text-xs dark:text-gray-400 text-gray-600 break-all p-4 border-b border-gray-200 dark:border-gray-700'
      }
      data-cy={message.method}
    >
      <div className="mb-2">{date}</div>
      <div>
        <div className="mb-2">
          <MessageSignature message={message} />
        </div>
        <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono return-value">{`${
          message.returnType &&
          encodeTypeDef(api.registry, message.returnType) === 'u128' &&
          isBn(data)
            ? fromSats(api, data)
            : data
        }`}</div>
      </div>
      {error && (
        <ReactMarkdown
          // eslint-disable-next-line react/no-children-prop
          children={error.docs.join('\r\n')}
          remarkPlugins={[remarkGfm]}
          className="markdown mt-4"
        />
      )}
    </div>
  );
};
