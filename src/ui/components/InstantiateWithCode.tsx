import React from 'react';

export const InstantiateWithCode = () => {
  return (
    <>
      <div className="w-full mx-auto overflow-y-auto">
        <div className="grid lg:grid-cols-12 gap-5 px-5 py-3 m-2">
          <main className="lg:col-span-8 p-4">
            <div className="space-y-1 border-b pb-6 dark:border-gray-800 border-gray-200">
              <h1 className="text-2xl dark:text-white text-gray-700">
                Upload and Instantiate Contract
              </h1>
              <p className="dark:text-gray-400 text-gray-500 text-sm">
                You can instantiate a new contract from an existing code bundle here.
              </p>
            </div>
            <div className="flex flex-col py-4">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="mt-4">
                    <p className="text-gray-200">todo</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
          {/* <aside className="lg:col-span-4 md:pt-0 px-4 lg:pt-4">Aside</aside> */}
        </div>
      </div>
    </>
  );
};
