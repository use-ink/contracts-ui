import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wizard } from '../instantiate';
import { Loader } from '../Loader';
import { useInstantiate } from 'ui/contexts';

export function Instantiate () {
  const { pathname } = useLocation()
  const { isLoading } = useInstantiate();

  const isFromHash = /instantiate\/hash/.test(pathname);

  return (
    <Loader isLoading={isLoading}>
      <div className="w-full max-w-6xl overflow-y-auto px-5 py-3 m-2">
        <div className="grid md:grid-cols-12 gap-5">
          <div className="md:col-span-9 py-3 px-4">
            <div className="space-y-1 border-b pb-6 dark:border-gray-800 border-gray-200">
              <h1 className="text-2.5xl dark:text-white text-gray-700">
                {isFromHash
                  ? 'Instantiate Contract from Code Hash'
                  : 'Upload and Instantiate Contract'
                }
              </h1>
              <p className="dark:text-gray-400 text-gray-500 text-sm">
                {isFromHash
                  ? (
                    <>
                      You can upload and instantate new contract code{' '}
                      <Link to="/instantiate/new" className="text-blue-500">
                        here
                      </Link>
                      .
                    </>
                  )
                  : (
                    <>
                      You can instantiate a new contract from an existing code bundle{' '}
                      <Link to="/instantiate/hash" className="text-blue-500">
                        here
                      </Link>
                      .
                    </>
                  )
                }
              </p>
            </div>
          </div>
        </div>
        <Wizard />
      </div>
    </Loader>
  );
};
