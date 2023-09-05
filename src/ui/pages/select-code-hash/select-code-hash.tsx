// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Link } from 'react-router-dom';

import { LookUpCodeHash } from '../../shared/look-up-code-hash';
import { AvailableCodeBundles } from '../instantiate/available-code-bundles';
import { RootLayout } from 'ui/layout';

export function SelectCodeHash() {
  return (
    <RootLayout
      heading="Instantiate Contract from Code Hash"
      help={
        <>
          You can upload and instantate new contract code{' '}
          <Link className="text-blue-500" to="/instantiate">
            here
          </Link>
          .
        </>
      }
    >
      <LookUpCodeHash />
      <AvailableCodeBundles />
    </RootLayout>
  );
}
