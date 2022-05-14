// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import type { Collection, Database } from '@textile/threaddb';
import type { VoidFn } from './substrate';

export type { Collection, Database };

interface Document {
  _id?: string;
}

export interface CodeBundleDocument extends Document {
  abi?: Record<string, unknown>;
  codeHash: string;
  creator: string;
  date: string;
  id: string;
  instances: number;
  name: string;
  owner?: string;
  tags?: string[];
}

export interface ContractDocument extends Document {
  abi: Record<string, unknown>;
  address: string;
  codeHash: string;
  creator: string;
  date: string;
  name: string;
  owner?: string;
  tags?: string[];
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
  document?: CodeBundleDocument;
};

export interface DbState {
  db: Database;
  myContracts: ContractDocument[] | null;
  refreshUserData: () => void;
  isDbReady: boolean;
}

export interface DbStatistics {
  codeBundlesCount: number;
  contractsCount: number;
}
