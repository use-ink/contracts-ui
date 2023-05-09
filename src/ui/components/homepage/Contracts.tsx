// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FolderOpenIcon, TrashIcon } from '@heroicons/react/outline';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContractRow } from '../contract/ContractRow';
import { ForgetAllContractsModal } from 'ui/components/modal';
import { useDatabase } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';

export function Contracts(): React.ReactElement | null {
  const { db } = useDatabase();
  const [isOpen, setIsOpen] = useState(false);
  const [contracts, isLoading] = useDbQuery(() => db.contracts.toArray(), [db]);
  const forgetAllContracts = useCallback(() => db.contracts.clear(), [db]);

  if (isLoading || !contracts) {
    return null;
  }

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-2 text-sm border dark:text-gray-500 dark:border-gray-700  rounded py-7 px-5">
        <FolderOpenIcon className="w-8 h-8" />
        <div>You haven&apos;t uploaded any contracts yet on this browser.</div>
        <Link className="text-green-500" to={`/instantiate`}>
          Upload a new contract
        </Link>
      </div>
    );
  }

  return (
    <>
      <ForgetAllContractsModal confirm={forgetAllContracts} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div>
        <div className="border border-collapse overflow-hidden dark:border-gray-700 border-gray-200 rounded w-auto">
          {contracts?.map(contract => {
            return <ContractRow contract={contract} key={`contract-${contract.address}`} />;
          })}
        </div>
        <div className="grid pt-4 justify-items-end">
          <button
            className="flex font-semibold items-center dark:text-gray-300 dark:bg-elevation-1 dark:hover:bg-elevation-2 dark:border-gray-700 text-gray-600 hover:text-gray-400 border h-full p-3 rounded"
            onClick={() => setIsOpen(true)}
            title="Forget All Contracts"
          >
            <p className="mr-2 text-xs">Forget All Contracts</p>
            <TrashIcon className="w-4 dark:text-gray-500 mr-1 justify-self-end" />
          </button>
        </div>
      </div>
    </>
  );
}
