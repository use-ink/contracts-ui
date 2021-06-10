// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import type { MyCodeBundles, UseQuery } from '../types';
import { useDatabase } from './useDatabase';
import { useQuery } from './useQuery';


export function useMyCodeBundles(): UseQuery<MyCodeBundles> {
  const { findMyCodeBundles } = useDatabase();

  return useQuery(findMyCodeBundles);
}
