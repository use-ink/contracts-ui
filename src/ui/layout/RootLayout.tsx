// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HTMLAttributes } from 'react';
import { classes } from 'lib/util';

export function RootLayout({ accessory, heading, help, children, aside }: PageProps) {
  return (
    <section
      className={classes(
        'w-full overflow-y-auto p-10',
        aside && 'grid grid-cols-[1fr_400px] gap-10',
      )}
    >
      <div className="col-span-2 mb-6 max-h-[100px] bg-yellow-400 p-4 text-center text-lg font-semibold text-black">
        NOTE: This is an ALPHA version for the ink! v6 Alpha release. If you run into issues, please
        open an issue at{' '}
        <a className="text-purple-700" href="https://github.com/use-ink/contracts-ui">
          https://github.com/use-ink/contracts-ui
        </a>
      </div>
      <main>
        <header className="mb-10 space-y-1 border-b border-gray-200 pb-6 dark:border-gray-800">
          {accessory && <div className="float-right">{accessory}</div>}
          <h1 className="capitalize">{heading}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{help}</p>
        </header>

        <div className="flex h-full flex-col">{children}</div>
      </main>
      {aside && <aside className="flex flex-col">{aside}</aside>}
    </section>
  );
}

interface PageProps extends HTMLAttributes<HTMLDivElement> {
  accessory?: React.ReactNode;
  heading: React.ReactNode;
  help?: React.ReactNode;
  aside?: React.ReactNode;
}
