// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Dexie, { Table } from 'dexie';

export interface CodeBundleDocument {
  abi: Record<string, unknown>;
  codeHash: string;
  date: string;
  id?: number;
  name: string;
}

export interface ContractDocument extends CodeBundleDocument {
  abi: Record<string, unknown>;
  address: string;
  external?: boolean;
}

export class Database extends Dexie {
  codeBundles!: Table<CodeBundleDocument, number>;
  contracts!: Table<ContractDocument, number>;

  constructor(genesisHash: string) {
    super(`contracts-ui__${genesisHash}`);

    this.version(1).stores({
      codeBundles: '++id, codeHash, name, date',
      contracts: '++id, address, codeHash, name, date',
    });

    // Stores same as version 1, but with removes duplicate codeBundles and contracts during upgrade
    this.version(2)
      .stores({
        codeBundles: '++id, codeHash, name, date',
        contracts: '++id, address, codeHash, name, date',
      })
      .upgrade(async transaction => {
        const bundleCodeHashes = new Set<string>();
        const duplicateBundles: Array<CodeBundleDocument['id']> = [];

        const contractAddresses = new Set<string>();
        const duplicateContracts: Array<ContractDocument['id']> = [];

        // Iterate over all code bundles and collect id's of duplicate code hashes
        await Promise.all([
          transaction.table('codeBundles').each((codeBundle: CodeBundleDocument) => {
            if (bundleCodeHashes.has(codeBundle.codeHash)) {
              duplicateBundles.push(codeBundle.id);
            } else {
              bundleCodeHashes.add(codeBundle.codeHash);
            }
          }),
          transaction.table('contracts').each((contract: ContractDocument) => {
            if (contractAddresses.has(contract.address)) {
              duplicateContracts.push(contract.id);
            } else {
              contractAddresses.add(contract.address);
            }
          }),
        ]);

        return Promise.all([
          transaction.table('codeBundles').bulkDelete(duplicateBundles),
          transaction.table('contracts').bulkDelete(duplicateContracts),
        ]);
      });

    // Adds unique constraint on codeHash.codeHash and contracts.address
    // Needs new version because upgrade and new unique constraint throws an error,
    // Two step process works fine though
    this.version(3).stores({
      codeBundles: '++id, &codeHash, name, date',
      contracts: '++id, &address, codeHash, name, date',
    });
  }

  /**
   * Can be used to populate the initial v1 database with mock data.
   */
  _populateWithMockDataV1() {
    if (this.verno !== 1) return;

    // Populate is only called if the database did not exist
    this.on('populate', async () => {
      const CodeBundlesMock = (await import('./mocks/v1/codeBundles.json')).default;
      await this.table('codeBundles').bulkAdd(CodeBundlesMock);

      const ContractsMock = (await import('./mocks/v1/contracts.json')).default;
      await this.table('contracts').bulkAdd(ContractsMock);
    });
  }
}
