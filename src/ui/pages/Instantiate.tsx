// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Link, useParams } from 'react-router-dom';
import { InstantiateContextProvider } from 'ui/contexts';
import { Wizard } from 'ui/components/instantiate';

export function Instantiate() {
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();

  return (
    <div className="m-2 w-full overflow-y-auto overflow-x-hidden px-5 py-3">
      <div className="grid gap-5 md:grid-cols-12">
        <div className="p-4 md:col-span-9">
          <div className="space-y-1 border-b border-gray-200 pb-6 dark:border-gray-800">
            <h1 className="text-2.5xl font-semibold text-gray-700 dark:text-white">
              {codeHashUrlParam
                ? 'Instantiate Contract from Code Hash'
                : 'Upload and Instantiate Contract'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {codeHashUrlParam ? (
                <>
                  You can upload and instantiate new contract code{' '}
                  <Link to="/instantiate" className="text-blue-500">
                    here
                  </Link>
                  .
                </>
              ) : (
                <>
                  You can instantiate a new contract from an existing code bundle{' '}
                  <Link to="/hash-lookup" className="text-blue-500">
                    here
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <InstantiateContextProvider>
        <Wizard />
      </InstantiateContextProvider>
    </div>
  );
}
