// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 */
/* eslint-disable header/header */

import { Database, PrivateKey } from '@textile/threaddb';
import { getMockDbUsers, getMockCodeBundles, getMockContracts, getMockDbUpdates } from 'test-utils';
import { initDb } from 'db/util/init';
import { publicKeyHex } from 'db/util/identity';
import * as q from 'db/queries';
import { MOCK_CONTRACT_DATA } from 'ui/util';

import type { CodeBundleDocument, ContractDocument, UserDocument } from 'types';

describe('DB Queries', (): void => {
  let db: Database;
  // let testIdentities: PrivateKey[];

  let testUsers: [UserDocument, PrivateKey][];
  let testUserIds: string[];

  let testCodeBundles: CodeBundleDocument[];
  let testCodeBundleIds: string[];

  let testContracts: ContractDocument[];
  let testContractAddresses: string[];

  beforeAll(async (): Promise<void> => {
    db = await initDb('test');

    testUsers = getMockDbUsers(MOCK_CONTRACT_DATA.length);
    testCodeBundles = getMockCodeBundles();
    testContracts = getMockContracts(testCodeBundles);
  });
  afterAll(async () => {
    await db.delete();
  });
  it('getUser', async () => {
    testUserIds = (
      await Promise.all(
        testUsers.map(([user, identity]) => {
          return q.getUser(db, identity, user);
        })
      )
    ).map(user => user?._id || '');

    for (let i = 0; i < testUserIds.length; i++) {
      const document = await q.getUserCollection(db).findById(testUserIds[i]);

      expect(document).toBeTruthy();
      expect(document?.toJSON()).toEqual({ _id: testUserIds[i], ...testUsers[i][0] });
    }
  });

  it('createCodeBundle', async () => {
    testCodeBundleIds = (
      await Promise.all(
        testCodeBundles.map((codeBundle, index) => {
          return q.createCodeBundle(db, testUsers[index][1], codeBundle);
        })
      )
    ).map(({ id }) => id);

    for (let i = 0; i < testCodeBundleIds.length; i++) {
      const document = await q.getCodeBundleCollection(db).findOne({ id: testCodeBundleIds[i] });

      expect(document).toBeTruthy();
      expect(document).toMatchObject({
        owner: publicKeyHex(testUsers[i][1]),
        ...testCodeBundles[i],
      });
    }
  });

  it('createContract', async () => {
    const owners: PrivateKey[] = [];

    testContractAddresses = (
      await Promise.all(
        testContracts.map((contract, index) => {
          const identity = testUsers[index % MOCK_CONTRACT_DATA.length][1];

          owners.push(identity);

          return q.createContract(db, identity, contract, false);
        })
      )
    ).map(({ address }) => address);

    for (let i = 0; i < testContractAddresses.length; i++) {
      const document = await q
        .getContractCollection(db)
        .findOne({ address: testContractAddresses[i] });

      expect(document).toBeTruthy();
      expect(document).toMatchObject({ owner: publicKeyHex(owners[i]), ...testContracts[i] });
    }
  });

  it('findCodeBundleByHash', async () => {
    const { codeHash, blockZeroHash } = testCodeBundles[0];

    const result = await q.findCodeBundleByHash(db, { codeHash, blockZeroHash });

    expect(result).toBeTruthy();
    expect(result).toMatchObject({ ...testCodeBundles[0], instances: 1 });
  });

  it('findCodeBundleById', async () => {
    const result = await q.findCodeBundleById(db, testCodeBundles[0].id);

    expect(result).toBeTruthy();
    expect(result).toMatchObject({ ...testCodeBundles[0], instances: 1 });
  });

  it('findContractByAddress', async () => {
    const result = await q.findContractByAddress(db, testContracts[0].address);

    expect(result).toBeTruthy();
    expect(result).toMatchObject(testContracts[0]);
  });

  it('findUser', async () => {
    const document = await q.findUser(db, testUsers[0][1]);

    expect(document).toBeTruthy();
    expect(document).toEqual({ _id: testUserIds[0], ...testUsers[0][0] });
  });

  it('updateCodebundle', async () => {
    const updates = getMockDbUpdates(true);

    await q.updateCodeBundle(db, testCodeBundles[0].id, updates);

    const updatedDocument = await q.findCodeBundleById(db, testCodeBundles[0].id);

    expect(updatedDocument).toBeTruthy();
    expect(updatedDocument?.name).toEqual(updates.name);
    expect(updatedDocument?.tags).toEqual(updates.tags);
    expect(updatedDocument?.abi).toMatchObject(updates.abi as Record<string, unknown>);
  });

  it('updateContract', async () => {
    const updates = getMockDbUpdates();

    await q.updateContract(db, testContracts[0].address, updates, false);

    const updatedDocument = await q.findContractByAddress(db, testContracts[0].address);

    expect(updatedDocument).toBeTruthy();
    expect(updatedDocument?.name).toEqual(updates.name);
    expect(updatedDocument?.tags).toEqual(updates.tags);
  });

  it('starCodeBundle & unstarCodeBundle', async () => {
    let user: UserDocument | null;

    const codeBundle = (await q
      .getCodeBundleCollection(db)
      .findOne({ owner: { $ne: publicKeyHex(testUsers[0][1]) } })) as CodeBundleDocument;

    await q.starCodeBundle(db, testUsers[0][1], codeBundle.id);

    user = await q.findUser(db, testUsers[0][1]);

    expect(user?.codeBundlesStarred).toContain(codeBundle.id);

    await q.unstarCodeBundle(db, testUsers[0][1], codeBundle.id);

    user = await q.findUser(db, testUsers[0][1]);

    expect(user?.codeBundlesStarred).not.toContain(codeBundle.id);
  });

  it('starContract & unstarContract', async () => {
    let user;

    const contract = (await q
      .getContractCollection(db)
      .findOne({ owner: { $ne: publicKeyHex(testUsers[0][1]) } })) as ContractDocument;

    await q.starContract(db, testUsers[0][1], contract.address);

    user = await q.findUser(db, testUsers[0][1]);

    expect(user?.contractsStarred).toContain(contract.address);

    await q.unstarContract(db, testUsers[0][1], contract.address);

    user = await q.findUser(db, testUsers[0][1]);

    expect(user?.contractsStarred).not.toContain(contract.address);
  });

  it('findMyCodeBundles', async () => {
    const ownedCodeBundles = await q
      .getCodeBundleCollection(db)
      .find({ owner: publicKeyHex(testUsers[0][1]) })
      .toArray();
    const starredCodeBundles = (
      await q
        .getCodeBundleCollection(db)
        .find({ owner: { $ne: publicKeyHex(testUsers[0][1]) } })
        .toArray()
    ).map(document => ({ isExistent: true, value: document }));

    for (let i = 0; i < starredCodeBundles.length; i += 1) {
      starredCodeBundles[i].value.stars = await q.starCodeBundle(
        db,
        testUsers[0][1],
        starredCodeBundles[i].value.id
      );
    }

    const myCodeBundles = await q.findMyCodeBundles(db, testUsers[0][1]);

    expect(myCodeBundles).toBeTruthy();
    expect(myCodeBundles).toMatchObject({ owned: ownedCodeBundles, starred: starredCodeBundles });
  });

  it('findMyContracts', async () => {
    const ownedContracts = await q
      .getContractCollection(db)
      .find({ owner: publicKeyHex(testUsers[0][1]) })
      .toArray();
    const starredContracts = (
      await q
        .getContractCollection(db)
        .find({ owner: { $ne: publicKeyHex(testUsers[0][1]) } })
        .toArray()
    ).map(document => ({ isExistent: true, value: document }));

    for (let i = 0; i < starredContracts.length; i += 1) {
      starredContracts[i].value.stars = await q.starContract(
        db,
        testUsers[0][1],
        starredContracts[i].value.address
      );
    }

    const myCodeBundles = await q.findMyContracts(db, testUsers[0][1]);

    expect(myCodeBundles).toBeTruthy();
    expect(myCodeBundles).toMatchObject({ owned: ownedContracts, starred: starredContracts });
  });

  it('removeCodeBundle', async () => {
    const codeBundle = (await q
      .getCodeBundleCollection(db)
      .findOne({ owner: { $ne: publicKeyHex(testUsers[0][1]) } })) as CodeBundleDocument;

    await q.starCodeBundle(db, testUsers[0][1], codeBundle.id);

    await q.removeCodeBundle(db, codeBundle.id);

    const missingDocument = await q.findCodeBundleById(db, codeBundle.id);

    expect(missingDocument).not.toBeTruthy();

    const user = await q.findUser(db, testUsers[0][1]);

    const starredIndex = user?.codeBundlesStarred.findIndex(id => id === codeBundle.id);

    expect(starredIndex).toBeGreaterThanOrEqual(0);

    const myCodeBundles = await q.findMyCodeBundles(db, testUsers[0][1]);

    expect(myCodeBundles.starred[starredIndex as number]).toEqual({
      isExistent: false,
      value: { identifier: codeBundle.id },
    });
  });

  it('removeContract', async () => {
    const contract = (await q
      .getContractCollection(db)
      .findOne({ owner: { $ne: publicKeyHex(testUsers[0][1]) } })) as ContractDocument;

    await q.starContract(db, testUsers[0][1], contract.address);

    await q.removeContract(db, contract.address, false);

    const missingDocument = await q.findContractByAddress(db, contract.address);

    expect(missingDocument).not.toBeTruthy();

    const user = await q.findUser(db, testUsers[0][1]);

    const starredIndex = user?.contractsStarred.findIndex(address => address === contract.address);

    expect(starredIndex).toBeGreaterThanOrEqual(0);

    const myContracts = await q.findMyContracts(db, testUsers[0][1]);

    expect(myContracts.starred[starredIndex as number]).toEqual({
      isExistent: false,
      value: { identifier: contract.address },
    });
  });
});
