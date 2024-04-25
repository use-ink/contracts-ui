// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useDbQuery } from '.';
import { Abi } from 'types';
import { useDatabase } from 'ui/contexts';

export const useStoredMetadata = () => {
  const { db } = useDatabase();

  return useDbQuery(async () => {
    const collectedAbis = new Set();
    const storedAbis: Abi[] = [];
    await db.contracts.each(contract => {
      if (collectedAbis.has(contract.codeHash)) return;

      const abi = new Abi(contract.abi);
      storedAbis.push(abi);
      collectedAbis.add(contract.codeHash);
    });
    return storedAbis;
  }, [db]);
};
