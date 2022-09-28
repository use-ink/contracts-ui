// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RegistryError } from 'types';
import { CopyButton } from 'ui/components/common/CopyButton';

export function DryRunError({ error }: { error: RegistryError }) {
  return (
    <div className="mb-4 text-xs  break-normal">
      <>
        <div className="mb-1">DispatchError</div>
        <div
          className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-xs return-value dark:text-gray-400 text-gray-600 mb-2 break-all"
          data-cy="output"
        >
          {error.name}
          <CopyButton className="float-right" value={error.name} />
        </div>
      </>
      <div className="mb-1">Error docs</div>
      <div
        className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-xs return-value dark:text-gray-400 text-gray-600 mb-2 break-all"
        data-cy="output"
      >
        <ReactMarkdown
          // eslint-disable-next-line react/no-children-prop
          children={error?.docs.join('\r\n')}
          remarkPlugins={[remarkGfm]}
          className="markdown "
        />
      </div>
    </div>
  );
}
