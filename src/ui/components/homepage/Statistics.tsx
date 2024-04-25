// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useMemo, useState } from 'react';
import { useApi } from 'ui/contexts';
import { AnyJson, ApiPromise, ChainProperties } from 'types';

function getChainType(systemChainType: ChainProperties['systemChainType']): string {
  if (systemChainType.isDevelopment) return 'Development';
  if (systemChainType.isLocal) return 'Local';
  if (systemChainType.isLive) return 'Live';
  if (systemChainType.isCustom) return 'Custom';
  return 'Unknown';
}

export function Statistics(): React.ReactElement | null {
  const { api, systemChain, systemName, systemChainType, tokenSymbol } = useApi();

  const [blockNumber, setBlockNumber] = useState<AnyJson>('');

  useEffect(() => {
    async function listenToBlocks(api: ApiPromise) {
      return api.rpc.chain.subscribeNewHeads(header => {
        setBlockNumber(header.number.toHuman());
      });
    }
    let cleanUp: VoidFunction | undefined;
    listenToBlocks(api)
      .then(unsub => (cleanUp = unsub))
      .catch(console.error);

    return () => cleanUp && cleanUp();
  }, [api]);

  const entries = useMemo((): Record<string, React.ReactNode> => {
    return {
      'Chain Name': systemChainType.isDevelopment ? systemName : systemChain,
      'Chain Type': getChainType(systemChainType),
      'Highest Block': `#${blockNumber}`,
      Token: tokenSymbol,
    };
  }, [blockNumber, systemChain, systemChainType, systemName, tokenSymbol]);

  return (
    <>
      <div
        className="mb-8 grid w-full grid-cols-4 gap-4 border-b border-gray-200 pb-8 dark:border-gray-800 xl:grid-cols-2"
        data-cy="chain-info"
      >
        {Object.entries(entries).map(([label, value], i) => {
          return (
            <div key={`entry-${i}`}>
              <div className="mb-1 text-xs">{label}</div>
              <div className="dark:text-gray-400">{value}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
