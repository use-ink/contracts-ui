// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import type { ContractDocument, UseQuery, UserArtifacts } from '../types';
import { useDatabase } from './useDatabase';
import { useQuery } from './useQuery';


export function useMyContracts(): UseQuery<UserArtifacts<ContractDocument>> {
  const { findMyContracts } = useDatabase();

  return useQuery(findMyContracts);
}
