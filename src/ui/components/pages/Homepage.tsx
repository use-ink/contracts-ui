import React from 'react';
import { Contracts, HelpBox, Statistics } from 'ui/components/homepage'

export function Homepage () {
  return (
    <div className="content w-full mx-auto overflow-y-auto">
      <div className="flex flex-col xl:flex-row px-5 py-3 m-2">
        <main className="main order-2 lg:pr-8 xl:order-1">
          <div className="space-y-1 pb-1">
            <h1 className="text-lg pb-2 dark:text-white text-gray-700">
              Contracts
            </h1>
          </div>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 xl:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 xl:px-8">
                <Contracts />
              </div>
            </div>
          </div>
        </main>
        <aside className="aside flex-none order-1 xl:order-2">
          <HelpBox />
          <Statistics />
        </aside>
      </div>
    </div>
  );
};