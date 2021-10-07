// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import 'styled-components';
import { Identicon } from '@polkadot/react-identicon';
import { StarIcon as StarIconOutline } from '@heroicons/react/outline';
import { StarIcon as StarIconFill } from '@heroicons/react/solid';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { ContractDocument } from 'types';

interface Props {
  contract: ContractDocument;
  isStarred: boolean;
  onToggleStar: () => void;
}

export function ContractRow({
  contract: { address, name, stars, date },
  isStarred,
  onToggleStar,
}: Props) {
  const Star = isStarred ? StarIconFill : StarIconOutline;

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
      <div className="inline-flex cursor-pointer w-10 text-gray-500 dark:text-gray-400">
        <Button
          aria-label={isStarred ? 'Remove from favorites' : 'Add to favorites'}
          onClick={onToggleStar}
          variant="plain"
        >
          <Star className="w-4 mr-1 justify-self-end " aria-hidden="true" fontSize="1.5rem" />
          {stars}
        </Button>
      </div>
      <div className="w-14 text-gray-500 dark:text-gray-400">{moment(date).format('MMM d')}</div>
    </Link>
  );
}
