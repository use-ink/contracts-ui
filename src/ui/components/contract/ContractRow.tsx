// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Identicon } from '../account/Identicon';
import { ObservedBalance } from '../common/ObservedBalance';
import { ContractDocument } from 'types';
import { useApi } from 'ui/contexts';
import { displayDate, truncate } from 'lib/util';
import { getContractInfo } from 'services/chain';

interface Props {
  contract: ContractDocument;
}

export function ContractRow({ contract: { address, name, date } }: Props) {
  const { api } = useApi();
  const [isOnChain, setIsOnChain] = useState(true);

  useEffect(() => {
    getContractInfo(api, address)
      .then(info => {
        setIsOnChain(info ? true : false);
      })
      .catch(console.error);
  }, [address, api]);

  return (
    <Link
      className={`grid grid-cols-4 w-full cursor-pointer items-center border border-l-0 border-r-0 border-t-0 border-gray-200 p-3 text-sm last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-elevation-1`}
      to={`/contract/${address}`}
    >
      <div className="gap-2 flex flex-row">
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

      <div className="font-mono text-gray-500 dark:text-gray-400 justify-self-end">
        <ObservedBalance address={address} />
      </div>
    </Link>
  );
}
