// Copyright 2021 @paritytech/canvas-ui authors & contributors

import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentAddIcon, ChatAltIcon, CogIcon, HomeIcon } from '@heroicons/react/outline';

export function Sidebar() {
  return (
    <>
      <div className="flex sidebar">
        <div className="flex flex-col w-72">
          <div className="flex flex-col h-0 flex-1 border-r dark:border-gray-stroke border-gray-200 dark:bg-elevation-1 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 space-y-4" aria-label="Sidebar">
                <div className="px-6">
                  <Link
                    to="/"
                    className="dark:text-gray-300 text-gray-600 border w-full dark:border-gray-stroke border-gray-200 dark:bg-elevation-2 dark:hover:bg-elevation-2 hover:bg-gray-100 dark:hover:text-gray-300 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  >
                    <HomeIcon className="mr-3 h-5 w-5 dark:text-gray-500 dark:group-hover:text-gray-300 group-hover:text-gray-500" />
                    Home
                  </Link>
                </div>
                <div className="px-6">
                  <Link
                    to="/instantiate"
                    className="dark:text-gray-300 text-gray-600 border w-full dark:border-gray-stroke border-gray-200 dark:bg-elevation-2 dark:hover:bg-elevation-2 hover:bg-gray-100 dark:hover:text-gray-300 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  >
                    <DocumentAddIcon className="mr-3 h-5 w-5 dark:text-gray-500 dark:group-hover:text-gray-300 group-hover:text-gray-500" />
                    Add New Contract
                  </Link>
                </div>
              </nav>
            </div>

            <div className="flex-shrink-0 flex p-6">
              <div className="flex justify-between flex-shrink-0 w-full group">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
