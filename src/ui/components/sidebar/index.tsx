// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Footer } from './Footer';
import { Navigation } from './Navigation';
import { NetworkAndUser } from './NetworkAndUser';
import { QuickLinks } from './QuickLinks';

export function Sidebar() {
  return (
    <>
      <div className="sidebar hidden md:flex">
        <div className="sidebar-inner">
          <div className="upper">
            <nav aria-label="Sidebar">
              <NetworkAndUser />
              <Navigation />
              <QuickLinks />
            </nav>
          </div>
          <Footer />
        </div>
      </div>
      <div className="mobilemenu flex w-screen justify-center px-4 py-3 md:hidden">
        <div className="flex-none w-8	h-8">M</div>
        <div className="flex flex-1 justify-center items-center">
          <h1>Contracts UI</h1>
        </div>
        <div className="flex-none text-center w-8	h-8 border border-gray-700 rounded">M</div>
      </div>
    </>
  );
}
