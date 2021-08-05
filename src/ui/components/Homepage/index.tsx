import React from 'react';
import { Contracts } from './Contracts';
import { HelpBox } from './HelpBox';
import { Statistics } from './Statistics';

export function Homepage () {
  return (
    <div className="w-full mx-auto overflow-y-auto">
      <div className="grid max-w-5xl lg:grid-cols-12 gap-5 px-5 py-3 m-2">
        <main className="lg:col-span-8 p-4">
          <div className="space-y-1 pb-1">
            <h1 className="text-lg pb-2 dark:text-white text-gray-700">
              Contracts
            </h1>
          </div>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <Contracts />
              </div>
            </div>
          </div>
        </main>
        <aside className="flex-none md:max-w-sm" style={{minWidth: "360px"}}>
          <HelpBox />
          <Statistics />
        </aside>
      </div>
    </div>
  );
};