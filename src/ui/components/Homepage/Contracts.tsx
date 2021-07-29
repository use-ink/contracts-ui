import React, { useCallback } from 'react';
import { Identicon } from '@polkadot/react-identicon';
import { StarIcon as StarIconOutline } from '@heroicons/react/outline';
import { StarIcon as StarIconFill } from '@heroicons/react/solid';
import moment from 'moment';
import { useDatabase } from 'ui/contexts';
import { useToggleContractStar, useTopContracts } from 'ui/hooks';
import { Link } from 'react-router-dom';

export function Contracts (): React.ReactElement {
  const { refreshUser, user } = useDatabase();
  const { data: contracts, refresh } = useTopContracts();
  const toggleContractStar = useToggleContractStar();

  const onClickStar = useCallback(
    (address: string) => {
      if (!user) {
        console.log('Not signed in')
        return;
      }

      toggleContractStar(address)
        .then(() => {
          refresh();
          refreshUser();
        })
        .catch(console.error)
    },
    [toggleContractStar]
  )

  return (
    <div className="border border-collapse dark:border-gray-700 border-gray-200 rounded w-auto">
      {contracts?.map(({ address, name, stars, date }, index) => {
        const isStarred = user?.contractsStarred.includes(address);

        const Star = isStarred ? StarIconFill : StarIconOutline;

        return (
          <Link
            key={`contract-${index}`} 
            to={`/contract/${address}`}
            className={`text-sm inline-flex cursor-pointer w-full hover:bg-gray-50 dark:hover:bg-elevation-1 border p-3 border-t-0 border-r-0 border-l-0 ${index === contracts.length - 1 && 'border-b-0'} dark:text-white dark:border-gray-700 border-gray-200`}
          >
            <Identicon size={18} value={address} className="pr-2" />
            <div className="w-36">
              {name}
            </div>
            <div className="flex-grow text-gray-500 dark:text-gray-400" >
              {address.slice(0, 4)}...{address.slice(-4)}
            </div>
            <div
              className="inline-flex cursor-pointer w-10 text-gray-500 dark:text-gray-400"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClickStar(address) }}
            >
              <Star
                className="w-4 mr-1 justify-self-end "
                aria-hidden="true"
                fontSize="1.5rem"
              />
              {stars}
            </div>
            <div
              className="w-10 text-gray-500 dark:text-gray-400"
            >
              {moment(date).format('MMM d')}
            </div>
          </Link>
        )
      })}
    </div>
  );
}