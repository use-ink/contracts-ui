// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ShareIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { NetworkAndUser } from './NetworkAndUser';

export function MobileMenu() {
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);

  const toggleNetworkMenu = () => {
    networkMenuOpen === false ? setNetworkMenuOpen(true) : setNetworkMenuOpen(false);
  };

  return (
    <div className="dark:bg-elevation-1">
      <div className="mobilemenu flex w-screen justify-center px-4 py-3 md:hidden">
        <div className="flex-none w-8 h-8">M</div>
        <div className="flex flex-1 justify-center items-center">
          <h1>Contracts UI</h1>
        </div>
        <button
          className="flex-none text-center w-8 h-8 border border-gray-700 rounded"
          onClick={toggleNetworkMenu}
        >
          <ShareIcon className="w-5 h-5 mx-auto text-gray-300" />
        </button>
      </div>
      {networkMenuOpen && (
        <>
          <hr className="border border-gray-700 mx-4" />
          <div className="px-4 py-3">
            <NetworkAndUser />
          </div>
        </>
      )}
    </div>
  );
}
