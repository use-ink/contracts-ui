import React from 'react';
import { useParams } from 'react-router-dom';
import { Interact } from '../contract/Interact';
import { getInstanceFromStorage, call } from 'canvas';
import { useCanvas } from 'ui/contexts';

type UrlParams = { addr: string };

export const Contract = () => {
  const { api, keyring } = useCanvas();
  const { addr } = useParams<UrlParams>();
  const contract = getInstanceFromStorage(addr.toString(), api);
  const keyringPairs = keyring?.getPairs() || null;

  return (
    <>
      <div className="w-full mx-auto overflow-y-auto">
        <div className="grid lg:grid-cols-12 gap-5 px-5 py-3 m-2 h-full">
          <main className="lg:col-span-8 p-4">
            <div className="space-y-1 border-b pb-6 dark:border-gray-800 border-gray-200">
              <h1 className="text-2xl dark:text-white text-gray-700">
                {contract?.abi.project.contract.name}
              </h1>
              <p className="dark:text-gray-400 text-gray-500 text-sm">
                to do: display deployer and date
              </p>
            </div>
            <div className="flex flex-col py-4 h-full">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 h-full">
                <div className="py-2 align-middle min-w-full sm:px-6 lg:px-8 h-full">
                  <div className="mt-4">
                    <div className="text-gray-200">
                      <Interact
                        address={addr}
                        metadata={contract?.abi.json}
                        keyringPairs={keyringPairs}
                        callFn={call}
                      />
                    </div>
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
