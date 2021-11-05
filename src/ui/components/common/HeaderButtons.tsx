// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ArrowCircleRightIcon, StarIcon as StarIconOutline } from '@heroicons/react/outline';
import { StarIcon as StarIconFill } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import { useDatabase } from 'ui/contexts';
import type { ContractDocument } from 'types';

interface Props {
  contract: ContractDocument;
}

export function HeaderButtons({ contract }: Props) {
  const { user } = useDatabase();
  const isOwned = !!user?.publicKey && user?.publicKey === contract.owner;
  const isFavorited = user?.contractsStarred.includes(contract.address);
  const Star = isOwned || isFavorited ? StarIconFill : StarIconOutline;

  return (
    <div className="inline-flex dark:text-gray-300 relative h-8 text-xs right-0">
      <div className="inline-flex mr-2 items-center">
        <button
          className="flex items-center dark:text-gray-300 dark:bg-elevation-1 dark:hover:bg-elevation-2 dark:border-gray-700 border h-full px-3 rounded-l"
          disabled={isOwned}
        >
          <Star
            className="w-4 dark:text-gray-500 mr-0.5 justify-self-end "
            aria-hidden="true"
            fontSize="1.5rem"
          />
          {isOwned ? 'Owned' : isFavorited ? 'Unstar' : 'Star'}
        </button>
        <div className="flex items-center dark:bg-elevation-1 dark:border-gray-700 border border-l-0 h-full px-3 rounded-r">
          {contract.stars || '0'}
        </div>
      </div>
      <div className="inline-flex h-8">
        <Link to={`/instantiate/hash/${contract.codeHash}`}>
          <button className="flex items-center dark:text-gray-300 dark:bg-elevation-1 dark:hover:bg-elevation-2 dark:border-gray-700 border h-full px-3 rounded">
            <ArrowCircleRightIcon
              className="w-4 dark:text-gray-500 mr-0.5 justify-self-end "
              aria-hidden="true"
              fontSize="1.5rem"
            />
            Reinstantiate
          </button>
        </Link>
      </div>
    </div>
  );
}
