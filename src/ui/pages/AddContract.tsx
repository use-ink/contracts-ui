// Copyright 2022-2024 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Link } from 'react-router-dom';
import { ChevronRightIcon, CodeIcon, UploadIcon, DocumentAddIcon } from '@heroicons/react/outline';
import { RootLayout } from 'ui/layout';

export function AddContract() {
  return (
    <RootLayout
      heading="Add New Contract"
      help={
        <>
          You can upload and instantiate new contract code, or use contract code that already exists
          on-chain.
        </>
      }
    >
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="mt-4">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="mt-4">
                  <Link
                    className="mb-10 flex items-center justify-between rounded-md border border-gray-200 px-6 py-4 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-elevation-1 dark:hover:bg-elevation-2"
                    to="/instantiate"
                  >
                    <div className="flex items-center space-x-2 text-base text-gray-500 dark:text-gray-300">
                      <UploadIcon className="h-8 w-8 text-gray-400 group-hover:text-gray-500 dark:text-gray-500" />
                      <span>Upload New Contract Code</span>
                    </div>
                    <ChevronRightIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </Link>
                  <Link
                    className="mb-10 flex items-center justify-between rounded-md border border-gray-200 px-6 py-4 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-elevation-1 dark:hover:bg-elevation-2"
                    to="/hash-lookup"
                  >
                    <div className="flex items-center space-x-2 text-base text-gray-500 dark:text-gray-300">
                      <CodeIcon className="h-8 w-8 text-gray-400 group-hover:text-gray-500 dark:text-gray-500" />
                      <span>Use On-Chain Contract Code</span>
                    </div>
                    <ChevronRightIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </Link>
                  <Link
                    className="mb-10 flex items-center justify-between rounded-md border border-gray-200 px-6 py-4 text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-elevation-1 dark:hover:bg-elevation-2"
                    to="/address-lookup"
                  >
                    <div className="flex items-center space-x-2 text-base text-gray-500 dark:text-gray-300">
                      <DocumentAddIcon className="h-8 w-8 text-gray-400 group-hover:text-gray-500 dark:text-gray-500" />
                      <span>Use On-Chain Contract Address</span>
                    </div>
                    <ChevronRightIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
