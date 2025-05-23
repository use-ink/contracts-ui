// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { V } from 'vitest/dist/chunks/reporters.nr4dxCkA.js';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';
import { Navigation } from './Navigation';
import { NetworkAndUser } from './NetworkAndUser';
import { QuickLinks } from './QuickLinks';
import { VersionSelect } from './VersionSelect';

export function Sidebar() {
  return (
    <>
      <div className="sidebar hidden md:flex">
        <div className="sidebar-inner">
          <div className="upper">
            <nav aria-label="Sidebar">
              <NetworkAndUser />
              <VersionSelect />
              <Navigation />
              <QuickLinks />
            </nav>
          </div>
          <Footer />
        </div>
      </div>
      <MobileMenu />
    </>
  );
}
