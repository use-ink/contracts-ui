// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
