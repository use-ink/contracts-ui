// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Identicon } from '../account/Identicon';
import { ObservedBalance } from '../common/ObservedBalance';
import { ContractDocument } from 'types';
import { useApi, useVersion } from 'ui/contexts';
import { displayDate, truncate } from 'lib/util';
import { getContractInfo } from 'services/chain';
import { fromEthAddress } from 'lib/address';
import { isAddress as isEthAddress } from 'ethers';

interface Props {
  contract: ContractDocument;
}

export function ContractRow({ contract: { address, name, date } }: Props) {
  const { api } = useApi();
  const { version } = useVersion();
  const [isOnChain, setIsOnChain] = useState(true);
  const isMismatch = version === 'v6' && !isEthAddress(address);

  useEffect(() => {
    getContractInfo(api, address, version)
      .then(info => {
        setIsOnChain(info ? true : false);
      })
      .catch(console.error);
  }, [address, api]);

  return (
    <Link
      className={`grid w-full cursor-pointer grid-cols-4 items-center border border-l-0 border-r-0 border-t-0 border-gray-200 p-3 text-sm last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-elevation-1`}
      to={`/contract/${address}`}
    >
      <div className="flex flex-row gap-2">
        <Identicon size={18} value={address} />
        <div>{name}</div>
      </div>

      {isOnChain ? (
        <div className="font-mono text-gray-500 dark:text-gray-400" title={address}>
          {truncate(address, 4)}
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400">not on-chain</div>
      )}
      <div className="text-gray-500 dark:text-gray-400">{displayDate(date)}</div>

      <div className="justify-self-end font-mono text-gray-500 dark:text-gray-400">
        {isMismatch ? (
          <span className="text-xs text-red-500">Not compatible with ink! v6</span>
        ) : (
          <ObservedBalance address={version === 'v6' ? fromEthAddress(address) : address} />
        )}
      </div>
    </Link>
  );
}
