// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useCallback } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { useQuery } from './useQuery';
import { findCodeBundleByHash  } from 'db/queries';

import type { CodeBundleDocument, UseQuery } from 'types';

type ReturnType = [boolean, CodeBundleDocument | null];

export function useCodeBundle(codeHash?: string): UseQuery<[boolean, CodeBundleDocument | null]> {
  const { api, blockOneHash } = useCanvas();
  const { db } = useDatabase();

  const query = useCallback(
    async (): Promise<ReturnType> => {
      if (!codeHash) {
        return Promise.resolve([false, null]);
      }

      const isOnChain = (await api!.query.contracts.codeStorage(codeHash)).isSome;


      if (!isOnChain) {
        return [false, null];
      }

      const document = await findCodeBundleByHash(db, { blockOneHash, codeHash });

      return [true, document];
    },
    [codeHash, findCodeBundleByHash]
  );

  return useQuery(query);
}
