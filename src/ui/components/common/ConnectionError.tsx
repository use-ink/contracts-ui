// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router-dom';
import { Error } from './Error';
import { useApi } from 'ui/contexts';
import { useVersion } from 'ui/contexts';
import { ROCOCO_CONTRACTS, LOCAL } from 'src/constants';

function ContractsNodeHelp() {
  const navigate = useNavigate();
  const { version } = useVersion();
  const nodeName = version === 'v6' ? 'ink-node' : 'substrate-contracts-node';
  const repoUrl =
    version === 'v6'
      ? 'https://github.com/use-ink/ink-node'
      : 'https://github.com/use-ink/substrate-contracts-node';
  // TODO: Change default chain depending on the version
  return (
    <>
      <div className="flex flex-col items-center">
        <div>
          Make sure you are running a local{' '}
          <a className="whitespace-nowrap" href={repoUrl} rel="noreferrer" target="_blank">
            {nodeName}
          </a>
          .
        </div>
        <div className="mt-1 rounded bg-slate-200 px-3 py-1 font-mono text-sm dark:bg-slate-800 dark:text-gray-400">
          {nodeName} --dev
        </div>
      </div>
      <div>
        Alternatively, connect to{' '}
        <a
          className="whitespace-nowrap"
          href="#"
          onClick={() => {
            navigate(`/?rpc=${ROCOCO_CONTRACTS.rpc}`);
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
      {endpoint === LOCAL.rpc && <ContractsNodeHelp />}
    </Error>
  );
}
