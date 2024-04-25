// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Link, useParams } from 'react-router-dom';
import { RootLayout } from '../layout/RootLayout';
import { Wizard } from 'ui/components/instantiate';
import { InstantiateContextProvider } from 'ui/contexts';

export function Instantiate() {
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();

  return (
    <RootLayout
      heading={
        codeHashUrlParam ? 'Instantiate Contract from Code Hash' : 'Upload and Instantiate Contract'
      }
      help={
        codeHashUrlParam ? (
          <>
            You can upload and instantiate new contract code{' '}
            <Link className="text-blue-500" to="/instantiate">
              here
            </Link>
            .
          </>
        ) : (
          <>
            You can instantiate a new contract from an existing code bundle{' '}
            <Link className="text-blue-500" to="/hash-lookup">
              here
            </Link>
            .
          </>
        )
      }
    >
      <InstantiateContextProvider>
        <Wizard />
      </InstantiateContextProvider>
    </RootLayout>
  );
}
