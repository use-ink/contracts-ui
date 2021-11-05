// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { mockKeyring, customRender } from 'test-utils';
import '@testing-library/jest-dom/extend-expect';
import { Account } from 'ui/components/account/Account';
import { truncate } from 'ui/util';

describe('Account', () => {
  test('correctly renders', () => {
    const account = mockKeyring.getAccounts()[0];

    const [{ container, getByText }] = customRender(
      <Account className="foo" value={account.address} />
    );

    expect(container).toBeInTheDocument();
    expect(container.childNodes[0]).toHaveClass('foo');

    expect(getByText(account.meta.name as string)).toBeInTheDocument();
    expect(getByText(truncate(account.address, 4))).toBeInTheDocument();
  });

  test('accepts override name prop', () => {
    const account = mockKeyring.getAccounts()[0];

    const [{ getByText }] = customRender(<Account name="My Account" value={account.address} />);

    expect(getByText('My Account')).toBeInTheDocument();
  });
});
