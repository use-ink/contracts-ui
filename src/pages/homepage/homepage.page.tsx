// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HelpBox } from './help-box';
import { Statistics } from './statistics';
import { Contracts } from './contracts';
import { RootLayout } from '~/layout';

export function Homepage() {
  return (
    <RootLayout
      aside={
        <>
          <HelpBox />
          <Statistics />
        </>
      }
      heading="Contracts"
    >
      <Contracts />
    </RootLayout>
  );
}
