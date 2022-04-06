// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  header: React.ReactNode;
  children: React.ReactNode[];
}

export function PageHome({
  header,
  children: [content, ...aside],
}: Props): React.ReactElement<Props> {
  return (
    <>
      <div className="content w-full mx-auto overflow-y-auto">
        <div className="flex flex-col xl:flex-row px-5 py-3 m-2">
          <main className="main order-2 lg:pr-8 xl:order-1">
            <div className="space-y-1 pb-1">
              <h1 className="text-lg font-semibold pb-2 dark:text-white text-gray-700">{header}</h1>
            </div>
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 xl:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 xl:px-8">
                  {content}
                </div>
              </div>
            </div>
          </main>
          <aside className="aside flex-none order-1 xl:order-2">{aside}</aside>
        </div>
      </div>
    </>
  );
}
