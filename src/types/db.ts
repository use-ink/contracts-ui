// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import type { Collection, Database } from '@textile/threaddb';
import type { PrivateKey } from '@textile/crypto';
import type { VoidFn } from './substrate';

export type { Collection, Database, PrivateKey }

interface Document {
  _id?: string;
}

export interface UserDocument extends Document {
  codeBundlesStarred: string[];
  contractsStarred: string[];
  creator: string;
  publicKey: string;
  email?: string;
  name: string;
}

export interface CodeBundleDocument extends Document {
  abi?: Record<string, unknown>;
  blockOneHash?: string;
  codeHash: string;
  creator: string;
  date: string;
  genesisHash: string;
  id: string;
  instances: number;
  name: string;
  owner?: string;
  stars: number;
  tags?: string[];
}

export interface ContractDocument extends Document {
  abi: Record<string, unknown>;
  address: string;
  blockOneHash?: string;
  codeBundleId: string;
  creator: string;
  date: string;
  genesisHash: string;
  name: string;
  owner?: string;
  stars: number;
  tags?: string[];
}

export interface UseQuery<T> {
  data: T | null;
  isLoading: boolean;
  isValid: boolean;
  refresh: VoidFn;
  updated: number;
}

export interface CodeBundleQuery {
  codeHash: string;
  blockOneHash?: string;
}

export interface Starred<T> {
  isExistent: boolean;
  value?: T | { identifier: string };
}

export interface UserArtifacts<T> {
  owned: Array<T>;
  starred: Array<Starred<T>>;
}

export interface DbState {
  db: Database;
  user: UserDocument | null;
  refreshUser: () => void;
  identity: PrivateKey | null;
  isDbReady: boolean;
}

export interface DbStatistics {
  codeBundlesCount: number;
  contractsCount: number;
  mostPopularCodeBundles: CodeBundleDocument[];
}

export type MyCodeBundles = UserArtifacts<CodeBundleDocument>;

export type MyContracts = UserArtifacts<ContractDocument>;