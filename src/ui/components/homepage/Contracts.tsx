import React, { useCallback } from 'react';
import { ContractRow } from '../contract/ContractRow';
import { useDatabase } from 'ui/contexts';
import { useToggleContractStar, useTopContracts } from 'ui/hooks';

export function Contracts (): React.ReactElement {
  const { refreshUser, user } = useDatabase();
  const { data: contracts, refresh } = useTopContracts();
  const toggleContractStar = useToggleContractStar();


  const onToggleStar = useCallback(
    (address: string): () => void => {
      return (): void => {
        if (!user) {
          console.error('Not signed in')
          return;
        }

        toggleContractStar(address)
          .then(() => {
            refresh();
            refreshUser();
          })
          .catch(console.error)
      };
    },
    [toggleContractStar]
  )

  return (
    <div className="border border-collapse dark:border-gray-700 border-gray-200 rounded w-auto">
      {contracts?.map((contract) => {
        const isStarred = user?.contractsStarred.includes(contract.address) || false;

        return (
          <ContractRow
            contract={contract}
            isStarred={isStarred}
            key={`contract-${contract.address}`}
            onToggleStar={onToggleStar(contract.address)}
          />
        );
      })}
    </div>
  );
}