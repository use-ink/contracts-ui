// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Identicon } from '../account/Identicon';
import { ContractDocument } from 'types';

interface Props {
  contract: ContractDocument;
  isStarred: boolean;
  onToggleStar?: () => void;
}

export function ContractRow({ contract: { address, name, date } }: Props) {
  return (
    <Link
      to={`/contract/${address}`}
      className={`text-sm inline-flex cursor-pointer w-full hover:bg-gray-50 dark:hover:bg-elevation-1 border p-3 border-t-0 border-r-0 border-l-0 last:border-b-0 dark:text-white dark:border-gray-700 border-gray-200`}
    >
      <Identicon size={18} value={address} className="pr-2" />
      <div className="w-36">{name}</div>
      <div className="flex-grow text-gray-500 dark:text-gray-400">
        {address.slice(0, 4)}...{address.slice(-4)}
      </div>
      <div className="w-14 text-gray-500 dark:text-gray-400">{moment(date).format('D MMM')}</div>
    </Link>
  );
}
