// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Link } from 'react-router-dom';
import { CopyButton } from '../components/common/CopyButton';
import { displayDate, truncate } from 'helpers';
import { UIContract } from 'types';

interface Props {
  document: UIContract;
}

export function ContractHeader({ document: { name, type, address, date, codeHash } }: Props) {
  switch (type) {
    case 'added':
      return (
        <div>
          You added this contract from{' '}
          <div className="inline-flex items-center">
            <span className="inline-block relative bg-blue-500 text-blue-400 bg-opacity-20 text-xs px-1.5 py-1 font-mono rounded">
              {truncate(address, 4)}
            </span>
            <CopyButton className="ml-1" value={address} id="header-address" />
          </div>{' '}
          on {displayDate(date)}
        </div>
      );
    case 'instantiated':
      return (
        <div>
          You instantiated this contract{' '}
          <div className="inline-flex items-center">
            <span className="inline-block relative bg-blue-500 text-blue-400 bg-opacity-20 text-xs px-1.5 py-1 font-mono rounded">
              {truncate(address, 4)}
            </span>
            <CopyButton className="ml-1" value={address} id="header-address" />
          </div>{' '}
          from{' '}
          <Link
            to={`/instantiate/${codeHash}`}
            className="inline-block relative bg-blue-500 text-blue-400 bg-opacity-20 text-xs px-1.5 py-1 font-mono rounded"
          >
            {name}
          </Link>{' '}
          on {displayDate(date)}
        </div>
      );
  }
}
