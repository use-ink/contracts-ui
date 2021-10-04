// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import type { Collection, Database } from '@textile/threaddb';
import type { PrivateKey } from '@textile/crypto';

export type { Collection, Database, PrivateKey };

interface Document {
  _id?: string;
}

export interface UserDocument extends Document {
  codeBundlesStarred: string[];
  contractsStarred: string[];
  creator?: string;
  publicKey: string;
  email?: string;
  name?: string;
}

export interface CodeBundleDocument extends Document {
  abi?: Record<string, unknown> | null;
  blockZeroHash?: string;
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
  blockZeroHash?: string;
  codeHash: string;
  creator: string;
  date: string;
  genesisHash: string;
  name: string;
  owner?: string;
  stars: number;
  tags?: string[];
}

export interface CodeBundleQuery {
  codeHash: string;
  blockZeroHash?: string | null;
}

export interface Starred<T> {
  isExistent: boolean;
  value?: T | { identifier: string };
}

export interface UserArtifacts<T> {
  owned: Array<T>;
  starred: Array<Starred<T>>;
}

export interface DbStatistics {
  codeBundlesCount: number;
  contractsCount: number;
  mostPopularCodeBundles: CodeBundleDocument[];
}

export type MyCodeBundles = UserArtifacts<CodeBundleDocument>;

export type MyContracts = UserArtifacts<ContractDocument>;
