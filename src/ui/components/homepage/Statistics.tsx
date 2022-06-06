// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useMemo, useState } from 'react';
import { formatNumber } from '@polkadot/util';
import { useApi, useDatabase } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';

export function Statistics(): React.ReactElement | null {
  const { api } = useApi();
  const { db } = useDatabase();

  const [blockNumber, setBlockNumber] = useState(0);
  const [statistics] = useDbQuery(async () => {
    return {
      codeBundlesCount: await db.codeBundles.count(),
      contractsCount: await db.contracts.count(),
    };
  }, [db]);

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
      'Highest Block': `#${formatNumber(blockNumber)}`,
      Nodes: 1,
      'Code Bundles Uploaded': statistics?.codeBundlesCount || 0,
      'Contracts Instantiated': statistics?.contractsCount || 0,
    };
  }, [blockNumber, statistics]);

  return (
    <>
      <div className="grid grid-cols-4 xl:grid-cols-2 w-full mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
        <div className="text-sm mb-4 col-span-4 xl:col-span-2 w-full">Chain Metrics</div>
        {Object.entries(entries).map(([label, value], i) => {
          return (
            <div key={`entry-${i}`} className="mb-4">
              <div className="text-xs mb-1">{label}</div>
              <div className="dark:text-gray-400">{value}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
