// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Link, useParams } from 'react-router-dom';
import { Wizard } from './wizard';
import { InstantiateContextProvider } from '~/context';

export function Instantiate() {
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();

  return (
    <div className="w-full px-5 py-3 m-2 overflow-x-hidden overflow-y-auto">
      <div className="grid gap-5 md:grid-cols-12">
        <div className="p-4 md:col-span-9">
          <div className="pb-6 space-y-1 border-b border-gray-200 dark:border-gray-800">
            <h1>
              {codeHashUrlParam
                ? 'Instantiate Contract from Code Hash'
                : 'Upload and Instantiate Contract'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {codeHashUrlParam ? (
                <>
                  You can upload and instantiate new contract code{' '}
                  <Link className="text-blue-500" to="/instantiate">
                    here
                  </Link>
                  .
                </>
              ) : (
                <>
                  You can instantiate a new contract from an existing code bundle{' '}
                  <Link className="text-blue-500" to="/hash-lookup">
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
