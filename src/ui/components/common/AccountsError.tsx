// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Error } from './Error';
import { useApi } from 'ui/contexts';

export function AccountsError() {
  return (
    <Error>
      <div>No injected accounts found.</div>
      <span>
        Follow{' '}
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://support.polkadot.network/support/solutions/articles/65000098878-how-to-create-a-dot-account"
        >
          this guide
        </a>{' '}
        to create your first Substrate account in the extension.
      </span>
    </Error>
  );
}

export function ExtensionError() {
  const { systemChain } = useApi();

  return (
    <Error>
      <div>No signer extension found.</div>
      <div className="text-center">
        <b>New to {systemChain}?</b>

        <p>
          Install the{' '}
          <a rel="noopener noreferrer" target="_blank" href="https://polkadot.js.org/extension/">
            Polkadot.js Extension
          </a>{' '}
          to create and manage Substrate accounts.
        </p>
      </div>
    </Error>
  );
}
