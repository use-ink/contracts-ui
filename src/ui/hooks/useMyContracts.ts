// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { useDatabase } from './useDatabase';
import { useQuery } from './useQuery';
import type { ContractDocument, UseQuery, UserArtifacts } from '@db/types';

export function useMyContracts(): UseQuery<UserArtifacts<ContractDocument>> {
  const { findMyContracts } = useDatabase();

  return useQuery(findMyContracts);
}
