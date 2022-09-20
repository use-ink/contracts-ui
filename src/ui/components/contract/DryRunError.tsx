// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RegistryError } from 'types';

export function DryRunError({
  debugMessage,
  error,
}: {
  debugMessage: string;
  error: RegistryError;
}) {
  return (
    <div>
      {error.name}
      <ReactMarkdown
        // eslint-disable-next-line react/no-children-prop
        children={error?.docs.join('\r\n')}
        remarkPlugins={[remarkGfm]}
        className="markdown mt-2"
      />
      {debugMessage}
    </div>
  );
}
