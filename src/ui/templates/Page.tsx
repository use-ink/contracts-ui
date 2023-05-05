// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HTMLAttributes } from 'react';

interface PageProps extends HTMLAttributes<HTMLDivElement> {
  header: React.ReactNode;
  help?: React.ReactNode;
}

export function Page({ header, help, children }: PageProps): React.ReactElement<PageProps> {
  return (
    <>
      <div className="mx-auto w-full overflow-y-auto">
        <div className="m-2 grid gap-5 px-5 py-3 md:grid-cols-12">
          <main className="p-4 md:col-span-8">
            <div className="space-y-1 border-b border-gray-200 pb-6 dark:border-gray-800">
              <h1>{header}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{help}</p>
            </div>
            <div className="flex flex-col py-4">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="mt-4 inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <>{children}</>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
