// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ChatAltIcon, CogIcon } from '@heroicons/react/outline';

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <a
          href="#"
          className="flex content-center text-xs font-medium dark:text-gray-500 text-gray-600 dark:hover:text-gray-300 hover:text-gray-500"
        >
          <ChatAltIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          Help &amp; Feedback
        </a>
        <a href="#">
          <CogIcon
            className="h-4 w-4 dark:text-gray-500 dark:hover:text-gray-300 text-gray-600 hover:text-gray-500"
            aria-hidden="true"
          />
        </a>
      </div>
    </footer>
  );
}
