// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useEffect, useState } from 'react';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { ContractDocument } from 'types';
import { useApi } from 'ui/contexts';
import { truncate } from 'ui/util';
import { getContractInfo } from 'api';

interface Props {
  contract: ContractDocument;
}

export function HeaderButtons({ contract }: Props) {
  const { api } = useApi();
  const [isOnChain, setIsOnChain] = useState(true);

  useEffect(() => {
    getContractInfo(api, contract.address)
      .then(info => {
        setIsOnChain(info ? true : false);
      })
      .catch(console.error);
  }, [api, contract.address]);

  return (
    <div className="inline-flex dark:text-gray-300 relative h-8 text-xs right-0">
      <div className="inline-flex h-8">
        {isOnChain ? (
          <Link to={`/instantiate/${contract.codeHash}`}>
            <button className="flex font-semibold items-center mr-2 dark:text-gray-300 dark:bg-elevation-1 dark:hover:bg-elevation-2 dark:border-gray-700 text-gray-600 hover:text-gray-400 border h-full px-3 rounded">
              <ArrowCircleRightIcon
                className="w-4 dark:text-gray-500 mr-1 justify-self-end"
                aria-hidden="true"
                fontSize="1.5rem"
              />
              Reinstantiate
            </button>
          </Link>
        ) : (
          <p className="flex font-semibold items-center mr-3 text-red-400">{`Not found at ${truncate(
            contract.address
          )}`}</p>
        )}
      </div>
    </div>
  );
}
