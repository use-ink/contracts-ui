// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ExclamationCircleIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import { useApi } from 'ui/contexts';
import { RPC } from 'src/constants';

function ContractsNodeHelp() {
  const navigate = useNavigate();
  return (
    <>
      <div className="mb-1 text-gray-500">
        <span>Make sure you are running a local </span>
        <a href="https://github.com/paritytech/substrate-contracts-node" target="_blank" rel="noreferrer" className="text-blue-400">
          substrate-contracts-node
        </a>
        .
      </div>
      <p className="py-1 px-3 dark:bg-slate-800 bg-slate-200 text-gray-500 dark:text-gray-400 font-mono mb-6 text-sm rounded">
        substrate-contracts-node --dev
      </p>
      <p className="text-gray-500">
        <span>Alternatively, connect to </span>
        <a
          href="#"
          onClick={() => {
            navigate(`/?rpc=${RPC.CANVAS}`);
          }}
          className="text-blue-400"
        >
          Canvas on Rococo.
        </a>
      </p>
    </>
  );
}

export function ConnectionError() {
  const { endpoint } = useApi();

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden px-5 py-3 m-2 flex justify-center items-center rounded-md">
      <div className=" w-7/12 h-60 border dark:border-gray-700 grid place-content-center justify-items-center">
        <ExclamationCircleIcon className="w-10 h-10 text-red-400 mb-1" />
        <p className="text-gray-500 mb-6">Could not connect to {endpoint}</p>
        {endpoint === RPC.LOCAL && <ContractsNodeHelp />}
      </div>
    </div>
  );
}
