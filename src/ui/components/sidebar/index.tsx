// Copyright 2021 @paritytech/canvas-ui authors & contributors

import React from 'react';
import { Footer } from './Footer';
import { Navigation } from './Navigation';
import { NetworkAndUser } from './NetworkAndUser';
import { QuickLinks } from './QuickLinks';

export function Sidebar () {
  return (
    <div className="sidebar">
      <div>
        <div>
          <nav aria-label="Sidebar">
            <NetworkAndUser />
            <Navigation />
            <QuickLinks />
          </nav>
        </div>
        <Footer />
      </div>
    </div>
  );
};
