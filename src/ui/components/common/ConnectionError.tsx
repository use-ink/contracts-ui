// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Error } from './Error';
import { useApi } from 'ui/contexts';
import { LOCAL } from 'src/constants';

function ContractsNodeHelp() {
  return (
    <>
      <div className="flex flex-col items-center">
        <div>
          Make sure you are running a local{' '}
          <a
            className="whitespace-nowrap"
            href="https://github.com/use-ink/substrate-contracts-node"
            rel="noreferrer"
            target="_blank"
          >
            substrate-contracts-node
          </a>
          .
        </div>
        <div className="mt-1 rounded bg-slate-200 px-3 py-1 font-mono text-sm dark:bg-slate-800 dark:text-gray-400">
          substrate-contracts-node --dev
        </div>
      </div>
    </>
  );
}

export function ConnectionError() {
  const { endpoint } = useApi();

  return (
    <Error>
      <div>Could not connect to {endpoint}</div>
      {endpoint === LOCAL.rpc && <ContractsNodeHelp />}
    </Error>
  );
}
