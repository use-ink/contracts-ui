// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { formatNumber } from '@polkadot/util';
import { StarIcon as StarIconOutline } from '@heroicons/react/outline';
import { StarIcon as StarIconFill } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/Button';
import { useApi, useDatabase } from 'ui/contexts';
import { useStatistics } from 'ui/hooks';

export function Statistics(): React.ReactElement | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { user } = useDatabase();

  const [blockNumber, setBlockNumber] = useState(0);
  const { data: statistics } = useStatistics();

  useEffect(() => {
    async function listenToBlocks() {
      return api?.rpc.chain.subscribeNewHeads(header => {
        setBlockNumber(header.number.toNumber());
      });
    }

    let cleanUp: VoidFunction;

    listenToBlocks()
      .then(unsub => (cleanUp = unsub))
      .catch(console.error);

    return () => cleanUp();
  }, [api]);

  const entries = useMemo((): Record<string, React.ReactNode> => {
    return {
      [t('highestBlock', 'Highest Block')]: `#${formatNumber(blockNumber)}`,
      [t('nodes', 'Nodes')]: 1,
      [t('codeBundlesUploaded', 'Code Bundles Uploaded')]: statistics?.codeBundlesCount || 0,
      [t('contractsInstantiated', 'Contracts Instantiated')]: statistics?.contractsCount || 0,
    };
  }, [t, blockNumber, statistics]);

  const onClickStar = useCallback(
    (id: string) => () => {
      if (!user) {
        console.error('Not signed in');
      }

      console.error('Toggled code bundle star ' + id);
    },
    [user]
  );

  return (
    <>
      <div className="grid grid-cols-4 xl:grid-cols-2 w-full mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
        <div className="text-sm mb-4 col-span-4 xl:col-span-2 w-full">
          {t('statisticsHeader', 'Chain Metrics')}
        </div>
        {Object.entries(entries).map(([label, value], i) => {
          return (
            <div key={`entry-${i}`} className="mb-4">
              <div className="text-xs mb-1">{label}</div>
              <div className="dark:text-gray-400">{value}</div>
            </div>
          );
        })}
      </div>
      {(statistics?.mostPopularCodeBundles || []).length > 0 && (
        <div className="grid grid-cols-4 xl:grid-cols-2 w-full">
          <div className="text-sm mb-4 col-span-4 xl:col-span-4">
            {t('popularContractCode', 'Popular Contract Code')}
          </div>
          {statistics?.mostPopularCodeBundles.map(({ id, name, instances, stars }, i) => {
            const isStarred = user?.contractsStarred.includes(id);

            const Star = isStarred ? StarIconFill : StarIconOutline;

            return (
              <div
                key={`code-bundle-${i}`}
                className="mb-4 col-span-2 xs:col-span-1 md:col-span-1 xl:col-span-1"
              >
                <div className="text-xs mb-1">{name}</div>
                <Button
                  className="flex text-xs dark:text-gray-400"
                  onClick={onClickStar(id)}
                  variant="plain"
                >
                  {stars}
                  <Star
                    className="w-4 ml-1 mr-2 justify-self-end "
                    aria-hidden="true"
                    fontSize="1.5rem"
                  />
                  {t('noInstances', '{{instances}} instances', { replace: { instances } })}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
