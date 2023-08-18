// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HTMLAttributes } from 'react';
import { Sidebar } from './sidebar';
import { classes } from 'helpers/util';

export function RootLayout({ accessory, heading, help, children, aside }: PageProps) {
  return (
    <div className="relative inset-0 flex min-h-screen overflow-hidden text-black dark:bg-gray-900 dark:text-white md:fixed md:flex-row">
      <Sidebar />
      <section
        className={classes(
          'p-10 overflow-y-auto w-full',
          aside && 'grid grid-cols-[1fr_400px] gap-10',
        )}
      >
        <main>
          <header className="pb-6 mb-10 space-y-1 border-b border-gray-200 dark:border-gray-800">
            {accessory && <div className="float-right">{accessory}</div>}
            <h1 className="capitalize">{heading}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{help}</p>
          </header>

          <div className="flex flex-col h-full">{children}</div>
        </main>
        {aside && <aside className="flex flex-col">{aside}</aside>}
      </section>
    </div>
  );
}

interface PageProps extends HTMLAttributes<HTMLDivElement> {
  accessory?: React.ReactNode;
  heading: React.ReactNode;
  help?: React.ReactNode;
  aside?: React.ReactNode;
}
