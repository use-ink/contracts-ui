// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import type { PrivateKey } from '@textile/hub';
// import type { AnyJson } from '@polkadot/types/types';
import type { Database } from '@textile/threaddb';
import type { VoidFn } from '@common/types';

interface Document {
  _id?: string;
}

export interface DbProps {
  db: Database;
  identity: PrivateKey | null;
  isDbReady: boolean;
  sync: () => Promise<void>;
}

export interface UserDocument extends Document {
  codeBundlesStarred: string[];
  contractsStarred: string[];
  publicKey: string;
  email?: string;
  name?: string;
}

export interface CodeBundleDocument extends Document {
  blockOneHash?: string;
  codeHash: string;
  genesisHash: string;
  abi?: unknown | null;
  id: string;
  name: string;
  owner?: string;
  tags?: string[];
}

export interface ContractDocument extends Document {
  abi: unknown;
  address: string;
  blockOneHash?: string;
  codeBundleId: string;
  genesisHash: string;
  name: string;
  owner?: string;
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
  value?: T;
}

export interface UserArtifacts<T> {
  owned: Array<T>;
  starred: Array<Starred<T>>;
}

export type MyCodeBundles = UserArtifacts<CodeBundleDocument>;

export type MyContracts = UserArtifacts<ContractDocument>;
