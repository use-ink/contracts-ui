// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { InstantiateWizard } from '../instantiate';
import { Page } from 'ui/templates';

export function InstantiateWithHash() {
  return (
    <Page
      header="Upload and Instantiate Contract"
      help="You can instantiate a new contract from an existing code bundle here."
    >
      <InstantiateWizard />
    </Page>
  );
}
