// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useCallback } from 'react';
import { FolderOpenIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { ContractRow } from '../contract/ContractRow';
import { useDatabase } from 'ui/contexts';
import { useToggleContractStar, useTopContracts } from 'ui/hooks';

export function Contracts(): React.ReactElement | null {
  const { refreshUserData, user } = useDatabase();
  const { data: contracts, isLoading, refresh } = useTopContracts();
  const toggleContractStar = useToggleContractStar();

  const onToggleStar = useCallback(
    (address: string): (() => void) => {
      return (): void => {
        if (!user) {
          console.error('Not signed in');
          return;
        }

        toggleContractStar(address)
          .then(() => {
            refresh();
            refreshUserData();
          })
          .catch(console.error);
      };
    },
    [refresh, refreshUserData, toggleContractStar, user]
  );

  if (isLoading) {
    return null;
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-2 text-sm border dark:text-gray-500 dark:border-gray-700  rounded py-7 px-5">
        <FolderOpenIcon className="w-8 h-8" />
        <div>No contracts found on this chain.</div>
        <Link to={`/instantiate`}>Upload a new contract</Link>
      </div>
    );
  }

  return (
    <div className="border border-collapse overflow-hidden dark:border-gray-700 border-gray-200 rounded w-auto">
      {contracts?.map(contract => {
        const isOwned = user?.publicKey && contract.owner === user.publicKey;
        const isStarred = isOwned || user?.contractsStarred.includes(contract.address) || false;

        return (
          <ContractRow
            contract={contract}
            isStarred={isStarred}
            key={`contract-${contract.address}`}
            onToggleStar={!isOwned ? onToggleStar(contract.address) : undefined}
          />
        );
      })}
    </div>
  );
}
