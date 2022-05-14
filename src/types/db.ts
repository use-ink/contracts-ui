// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import type { Collection, Database } from '@textile/threaddb';
import type { PrivateKey } from '@textile/crypto';
import type { VoidFn } from './substrate';
import { DB, CodeBundleDocument, ContractDocument } from 'db';

export type { CodeBundleDocument, Collection, ContractDocument, Database, PrivateKey };

interface Document {
  _id?: string;
}

export interface UserDocument extends Document {
  creator?: string;
  publicKey: string;
  email?: string;
  name?: string;
}

export interface DbState {
  db: DB;
  isDbReady: boolean;
}

export interface DbQuery<T> {
  data: T | null;
  error: ReactNode | null;
  isLoading: boolean;
  isValid: boolean;
  refresh: VoidFn;
  updated: number;
}
export type CodeBundle = {
  document: CodeBundleDocument | null;
};
export interface UserArtifacts<T> {
  owned: Array<T>;
}

export interface DbStatistics {
  codeBundlesCount: number;
  contractsCount: number;
  mostPopularCodeBundles: CodeBundleDocument[];
}

export type MyCodeBundles = UserArtifacts<CodeBundleDocument>;

export type MyContracts = UserArtifacts<ContractDocument>;
