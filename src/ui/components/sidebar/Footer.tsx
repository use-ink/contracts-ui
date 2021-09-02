import React from 'react';
import { ChatAltIcon, CogIcon } from '@heroicons/react/outline';

export function Footer () {
  return (
    <footer>
      <div>
        <a
          href="#"
          className="flex content-center text-sm font-medium dark:text-gray-500 text-gray-600 dark:hover:text-gray-300 hover:text-gray-500"
        >
          <ChatAltIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Help &amp; Feedback
        </a>
        <a href="#">
          <CogIcon
            className="h-5 w-5 dark:text-gray-500 dark:hover:text-gray-300 text-gray-600 hover:text-gray-500"
            aria-hidden="true"
          />
        </a>
      </div>
    </footer>
  );
};
