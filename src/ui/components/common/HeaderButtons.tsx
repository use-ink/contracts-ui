// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import type { ContractDocument } from 'types';

interface Props {
  contract: ContractDocument;
}

export function HeaderButtons({ contract }: Props) {
  return (
    <div className="inline-flex dark:text-gray-300 relative h-8 text-xs right-0">
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
