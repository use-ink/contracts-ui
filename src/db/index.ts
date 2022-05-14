// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Dexie, { Table } from 'dexie';

export * from './util';

export interface CodeBundleDocument {
  abi?: Record<string, unknown>;
  codeHash: string;
  date: string;
  id: string;
  name: string;
}

export interface ContractDocument {
  abi: Record<string, unknown>;
  address: string;
  codeHash: string;
  date: string;
  name: string;
}

export class DB extends Dexie {
  codeBundles!: Table<CodeBundleDocument, number>;
  contracts!: Table<ContractDocument, number>;

  constructor(genesisHash: string) {
    super(`canvas-ui__${genesisHash}`);

    this.version(1).stores({
      codeBundles: '++id, codeHash, name, date',
      contracts: '++id, address, codeHash, name, date',
    });
  }

  public getCodeBundle(codeHash: string) {
    return this.codeBundles.get({ codeHash });
  }
}
