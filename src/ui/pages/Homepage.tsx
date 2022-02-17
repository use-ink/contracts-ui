// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Contracts, HelpBox, Statistics } from '../components/homepage';
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
