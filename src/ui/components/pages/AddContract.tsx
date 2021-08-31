import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, CodeIcon, UploadIcon } from '@heroicons/react/outline';

export function AddContract() {
  return (
    <div className="w-full max-w-6xl overflow-y-auto">
      <div className="grid md:grid-cols-12 gap-5 px-5 py-3 m-2">
        <main className="md:col-span-8 p-4">
          <div className="space-y-1 border-b pb-6 dark:border-gray-800 border-gray-200">
            <h1 className="text-2xl dark:text-white text-gray-700">Add New Contract</h1>
            <p className="dark:text-gray-400 text-gray-500 text-sm">
              You can upload and instantiate new contract code, or use contract code that already
              exists on-chain.
            </p>
          </div>
          <div className="flex flex-col py-4">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="mt-4">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="mt-4">
                        <Link
                          to="/instantiate/code"
                          className="flex justify-between items-center px-6 py-4 border text-gray-500 dark:border-gray-700 border-gray-200 rounded-md dark:bg-elevation-1 dark:hover:bg-elevation-2 hover:bg-gray-100"
                        >
                          <div className="flex items-center text-base dark:text-gray-300 text-gray-500 space-x-2">
                            <UploadIcon className="h-8 w-8 dark:text-gray-500 text-gray-400 group-hover:text-gray-500" />
                            <span>Upload New Contract Code</span>
                          </div>
                          <ChevronRightIcon className="h-6 w-6 dark:text-gray-500 text-gray-400" />
                        </Link>
                        <p className="text-center text-sm text-gray-500 py-6">Or</p>
                        <Link
                          to="/instantiate/hash"
                          className="flex justify-between items-center px-6 py-4 border text-gray-500 dark:border-gray-700 border-gray-200 rounded-md dark:bg-elevation-1 dark:hover:bg-elevation-2 hover:bg-gray-100"
                        >
                          <div className="flex items-center text-base dark:text-gray-300 text-gray-500 space-x-2">
                            <CodeIcon className="h-8 w-8 dark:text-gray-500 text-gray-400 group-hover:text-gray-500" />
                            <span>Use Existing Contract Code</span>
                          </div>
                          <ChevronRightIcon className="h-6 w-6 dark:text-gray-500 text-gray-400" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* <aside className="lg:col-span-4 md:pt-0 px-4 lg:pt-4">Aside</aside> */}
      </div>
    </div>
  );
}
