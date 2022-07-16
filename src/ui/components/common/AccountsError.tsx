// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Error } from './Error';

export function AccountsError() {
  return (
    <Error>
      <div>No accounts found.</div>
      <p className="mb-3">
        1. Follow{' '}
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://support.polkadot.network/support/solutions/articles/65000098878-how-to-create-a-dot-account"
        >
          this guide
        </a>{' '}
        to create your first account in the Polkadot.js extension.
      </p>
      <p className="mb-3">
        2. Drip some funds into your account via the faucets of our supported networks.{' '}
      </p>
      <a
        rel="noopener noreferrer"
        target="_blank"
        href="https://github.com/paritytech/cumulus/blob/master/parachains/runtimes/contracts/contracts-rococo/README.md#rococo-deployment"
      >
        Contracts on Rococo
      </a>{' '}
      <a
        rel="noopener noreferrer"
        target="_blank"
        href="https://docs.astar.network/integration/testnet-faucet"
      >
        Shiden / Shibuya
      </a>{' '}
    </Error>
  );
}

export function ExtensionError() {
  return (
    <Error>
      <div>No signer extension found.</div>
      <div className="text-center flex flex-col items-center">
        <b>New to Substrate?</b>
        <p className="mb-3">
          Install the{' '}
          <a rel="noopener noreferrer" target="_blank" href="https://polkadot.js.org/extension/">
            Polkadot.js Extension
          </a>{' '}
          to create and manage Substrate accounts.
        </p>
        <p>
          If the extension is installed and you are seeing this, make sure it allows{' '}
          <span className="whitespace-nowrap">Contracts UI </span> to use your accounts for signing.
        </p>
      </div>
    </Error>
  );
}
