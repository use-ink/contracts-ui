// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MessageDocs } from 'ui/components';
import { AbiParam } from 'types';

describe('Message Docs', () => {
  const mockMessage = {
    identifier: 'test_message',
    docs: ['This is a test message.', 'It does absolutely `nothing`'],
    args: [{ name: 'TestArg', type: { displayName: 'TestArgType' } }] as AbiParam[],
  };

  const { identifier, docs } = mockMessage;

  test('correctly renders a message', () => {
    const { getByText } = render(
      <MessageDocs
        key={identifier}
        title={identifier}
        docs={docs}
        isConstructor={false}
        args={[]}
      />
    );
    const title = getByText(mockMessage.identifier);

    expect(title).toHaveClass('text-yellow-400');
  });
  test('correctly renders a constructor', () => {
    const { getByText } = render(
      <MessageDocs key={identifier} title={identifier} docs={docs} isConstructor={true} args={[]} />
    );
    const title = getByText(mockMessage.identifier);
    expect(title).toHaveClass('text-blue-400');
  });
  test('renders title and documentation with markdown', () => {
    const { getByText, container } = render(
      <MessageDocs
        key={identifier}
        title={identifier}
        docs={docs}
        isConstructor={false}
        args={[]}
      />
    );
    expect(getByText('test_message')).toBeInTheDocument();
    expect(container.getElementsByTagName('code').length).toBeGreaterThan(0);
  });
});
