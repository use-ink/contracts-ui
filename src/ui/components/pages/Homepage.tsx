// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Contracts, HelpBox, Statistics } from '../homepage';
import { PageHome } from 'ui/templates';

export function Homepage() {
  return (
    <PageHome header="Contracts">
      <Contracts />
      <HelpBox />
      <Statistics />
    </PageHome>
  );
}
