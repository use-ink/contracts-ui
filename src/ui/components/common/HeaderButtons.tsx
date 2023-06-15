// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { ArrowCircleRightIcon, TrashIcon } from '@heroicons/react/outline';
import { Link, useNavigate } from 'react-router-dom';
import { ForgetContractModal } from 'ui/components/modal';
import { useApi, useDatabase } from 'ui/contexts';
import { getContractInfo, truncate } from 'helpers';
import type { UIContract } from 'types';

interface Props {
  contract: UIContract;
}

export function HeaderButtons({ contract: { address, codeHash } }: Props) {
  const { api } = useApi();
  const { db } = useDatabase();
  const [isOnChain, setIsOnChain] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const forgetContract = async () => {
    await db.contracts.where({ address }).delete();

    navigate('/');
  };

  useEffect(() => {
    getContractInfo(api, address)
      .then(info => {
        setIsOnChain(info ? true : false);
      })
      .catch(console.error);
  }, [api, address]);

  return (
    <div className="relative right-0 inline-flex h-8 text-xs dark:text-gray-300">
      <div className="inline-flex h-8">
        {isOnChain ? (
          <Link to={`/instantiate/${codeHash}`}>
            <button className="mr-2 flex h-full items-center rounded border px-3 font-semibold text-gray-600 hover:text-gray-400 dark:border-gray-700 dark:bg-elevation-1 dark:text-gray-300 dark:hover:bg-elevation-2">
              <ArrowCircleRightIcon
                aria-hidden="true"
                className="mr-1 w-4 justify-self-end dark:text-gray-500"
                fontSize="1.5rem"
              />
              Reinstantiate
            </button>
          </Link>
        ) : (
          <p className="mr-3 flex items-center font-semibold text-red-400">{`Not found at ${truncate(
            address
          )}`}</p>
        )}
        <button
          className="flex h-full items-center rounded border px-3 font-semibold text-gray-600 hover:text-gray-400 dark:border-gray-700 dark:bg-elevation-1 dark:text-gray-300 dark:hover:bg-elevation-2"
          onClick={() => {
            setIsOpen(true);
          }}
          title="Forget contract"
        >
          <TrashIcon className="w-4 dark:text-gray-500 " />
        </button>
      </div>
      <ForgetContractModal confirm={forgetContract} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
