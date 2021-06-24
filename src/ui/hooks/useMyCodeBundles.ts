// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useDatabase } from './useDatabase';
import { useQuery } from './useQuery';
import type { MyCodeBundles, UseQuery } from '@db/types';

export function useMyCodeBundles(): UseQuery<MyCodeBundles> {
  const { findMyCodeBundles } = useDatabase();

  return useQuery(findMyCodeBundles);
}
