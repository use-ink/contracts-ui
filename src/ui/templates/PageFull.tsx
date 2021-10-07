// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { HTMLAttributes } from 'react';

interface PageProps extends HTMLAttributes<HTMLDivElement> {
  header: React.ReactNode;
  help?: React.ReactNode;
}

export function PageFull({ header, help, children }: PageProps): React.ReactElement<PageProps> {
  return (
    <>
      <div className="w-full mx-auto overflow-y-auto">
        <div className="grid md:grid-cols-12 h-full gap-5 px-5 py-3 m-2">
          <main className="md:col-span-12 p-4">
            <div className="space-y-1 border-b pb-6 dark:border-gray-800 border-gray-200">
              <h1 className="text-2xl dark:text-white text-gray-700 capitalize">{header}</h1>
              <p className="dark:text-gray-400 text-gray-500 text-sm">{help}</p>
            </div>
            <div className="flex flex-col py-4 h-full">
              <div className="-my-2 h-full overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full h-full sm:px-6 lg:px-8">
                  <div className="mt-4">{children}</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
