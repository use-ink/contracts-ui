import React from 'react';
import { mockKeyring, render } from 'test-utils';
import '@testing-library/jest-dom/extend-expect';
import { Account } from 'ui/components/Account';
import { truncate } from 'ui/util';

describe('Account', () => {
  test('correctly renders', () => {
    const account = mockKeyring.getAccounts()[0];

    const [{ container, getByText }] = render(<Account className="foo" value={account.address} />);

    expect(container).toBeInTheDocument();
    expect(container.childNodes[0]).toHaveClass('foo');

    expect(getByText(account.meta.name as string)).toBeInTheDocument();
    expect(getByText(truncate(account.address, 4))).toBeInTheDocument();
  });

  test('accepts override name prop', () => {
    const account = mockKeyring.getAccounts()[0];

    const [{ getByText }] = render(<Account name="My Account" value={account.address} />);

    expect(getByText('My Account')).toBeInTheDocument();
  });
});
