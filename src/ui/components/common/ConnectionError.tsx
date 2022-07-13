// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router-dom';
import { Error } from './Error';
import { useApi } from 'ui/contexts';
import { RPC } from 'src/constants';

function ContractsNodeHelp() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center">
        <div>
          Make sure you are running a local{' '}
          <a
            href="https://github.com/paritytech/substrate-contracts-node"
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap"
          >
            substrate-contracts-node
          </a>
          .
        </div>
        <div className="py-1 px-3 dark:bg-slate-800 bg-slate-200 dark:text-gray-400 font-mono text-sm mt-1 rounded">
          substrate-contracts-node --dev
        </div>
      </div>
      <div>
        Alternatively, connect to{' '}
        <a
          href="#"
          className="whitespace-nowrap"
          onClick={() => {
            navigate(`/?rpc=${RPC.CONTRACTS}`);
          }}
        >
          Contracts parachain on Rococo.
        </a>
      </div>
    </>
  );
}

export function ConnectionError() {
  const { endpoint } = useApi();

  return (
    <Error>
      <div>Could not connect to {endpoint}</div>
      {endpoint === RPC.LOCAL && <ContractsNodeHelp />}
    </Error>
  );
}
