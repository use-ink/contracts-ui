// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Error } from './Error';
import { useApi } from 'ui/contexts';

export function AccountsError() {
  const { systemChain } = useApi();

  return (
    <Error>
      <div>No injected accounts found.</div>
      <div className="text-left">
        <b>New to {systemChain}?</b>
        <ol className="list-decimal ml-6">
          <li>
            Install the Polkadot.js Extension{' '}
            <a rel="noopener noreferrer" target="_blank" href="https://polkadot.js.org/extension/">
              here
            </a>
            .
          </li>
          <li>
            Follow{' '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://support.polkadot.network/support/solutions/articles/65000098878-how-to-create-a-dot-account"
            >
              this guide
            </a>{' '}
            to create a {systemChain} account.
          </li>
        </ol>
      </div>
    </Error>
  );
}
