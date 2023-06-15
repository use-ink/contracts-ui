// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HTMLAttributes } from 'react';

interface PageProps extends HTMLAttributes<HTMLDivElement> {
  accessory?: React.ReactNode;
  header: React.ReactNode;
  help?: React.ReactNode;
}

export function PageFull({
  accessory,
  header,
  help,
  children,
}: PageProps): React.ReactElement<PageProps> {
  return (
    <>
      <div className="mx-auto w-full overflow-y-auto">
        <div className="m-2 grid h-full gap-5 px-5 py-3 md:grid-cols-12">
          <main className="p-4 md:col-span-12">
            <div className="space-y-1 border-b border-gray-200 pb-6 dark:border-gray-800">
              {accessory && <div className="float-right">{accessory}</div>}
              <h1 className="capitalize">{header}</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400">{help}</div>
            </div>
            <div className="flex h-full flex-col py-4">
              <div className="-my-2 h-full overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block h-full min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
