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
      <div className="content mx-auto w-full overflow-y-auto">
        <div className="m-2 flex flex-col px-5 py-3 xl:flex-row">
          <main className="main order-2 lg:pr-8 xl:order-1">
            <div className="space-y-1 pb-1">
              <h1 className="pb-2 text-lg font-semibold text-gray-700 dark:text-white">{header}</h1>
            </div>
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 xl:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 xl:px-8">
                  {content}
                </div>
              </div>
            </div>
          </main>
          <aside className="aside order-1 flex-none xl:order-2">{aside}</aside>
        </div>
      </div>
    </>
  );
}
