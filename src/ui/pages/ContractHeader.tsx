// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Link } from 'react-router-dom';
import { CopyButton } from '../components/common/CopyButton';
import { ObservedBalance } from '../components/common/ObservedBalance';
import { displayDate, truncate } from 'lib/util';
import { UIContract } from 'types';
import { useVersion } from 'ui/contexts';
import { fromEthAddress } from 'lib/address';

interface Props {
  document: UIContract;
}

export function ContractHeader({ document: { name, type, address, date, codeHash } }: Props) {
  const { version } = useVersion();
  switch (type) {
    case 'added':
      return (
        <div>
          You added this contract from{' '}
          <div className="inline-flex items-center" title={address}>
            <span className="relative inline-block rounded bg-blue-500 bg-opacity-20 px-1.5 py-1 font-mono text-xs text-blue-400">
              {truncate(address.toString(), 4)}
            </span>
            <CopyButton className="ml-1" id="header-address" value={address} />
          </div>{' '}
          on {displayDate(date)} and holds a value of{' '}
          <span className="relative inline-block rounded bg-blue-500 bg-opacity-20 px-1.5 py-1 font-mono text-xs text-blue-400">
            <ObservedBalance address={version === 'v6' ? fromEthAddress(address) : address} />
          </span>
        </div>
      );
    case 'instantiated':
      return (
        <div>
          You instantiated this contract{' '}
          <div className="inline-flex items-center">
            <span
              className="relative inline-block rounded bg-blue-500 bg-opacity-20 px-1.5 py-1 font-mono text-xs text-blue-400"
              title={address}
            >
              {truncate(address.toString(), 4)}
            </span>
            <CopyButton className="ml-1" id="header-address" value={address} />
          </div>{' '}
          from{' '}
          <Link
            className="relative inline-block rounded bg-blue-500 bg-opacity-20 px-1.5 py-1 font-mono text-xs text-blue-400"
            title={codeHash}
            to={`/instantiate/${codeHash}`}
          >
            {name}
          </Link>{' '}
          on {displayDate(date)} and holds a value of{' '}
          <span className="relative inline-block rounded bg-blue-500 bg-opacity-20 px-1.5 py-1 font-mono text-xs text-blue-400">
            <ObservedBalance address={version === 'v6' ? fromEthAddress(address) : address} />
          </span>
        </div>
      );
  }
}
