// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Link } from 'react-router-dom';
import { LookUpCodeHash, AvailableCodeBundles } from 'ui/components/instantiate';
import { Page } from 'ui/templates';

export function SelectCodeHash() {
  return (
    <Page
      header="Instantiate Contract from Code Hash"
      help={
        <>
          You can upload and instantate new contract code{' '}
          <Link to="/instantiate/new" className="text-blue-500">
            here
          </Link>
          .
        </>
      }
    >
      <LookUpCodeHash />
      <AvailableCodeBundles />
    </Page>
  );
}
