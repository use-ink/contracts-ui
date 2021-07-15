/**
 * @jest-environment ./db-test-env
 */
/* eslint-disable header/header */

import { Database, PrivateKey } from '@textile/threaddb';
import { TEST_DATA, getTestUsers, getTestCodeBundles, getTestContracts, getMockUpdates } from 'db/util/testing';
import { initDb } from 'db/util/init'
import { publicKeyHex } from 'db/util/identity';
import * as q from 'db/queries';

import type { CodeBundleDocument, ContractDocument, UserDocument } from 'types';

let db: Database;
let testIdentities: PrivateKey[];

let testUsers: UserDocument[];
let testUserIds: string[];

let testCodeBundles: CodeBundleDocument[];
let testCodeBundleIds: string[];

let testContracts: ContractDocument[];
let testContractAddresses: string[];

beforeAll(
  async (): Promise<void> => {
    db = await initDb('test-db');

    [testUsers, testIdentities] = getTestUsers();
    testCodeBundles = getTestCodeBundles();
    testContracts = getTestContracts(testCodeBundles);
  }
)

describe('DB Queries', (): void => {
  it('getUser', async () => {
    testUserIds = (await Promise.all(
      testUsers.map((user, index) => {
        return q.getUser(db, testIdentities[index], user);
      })
    )).map((user) => user?._id || '');

    for (let i = 0; i < testUserIds.length; i++) {
      const document = await q.getUserCollection(db).findById(testUserIds[i]);

      expect(document).toBeTruthy();
      expect(document?.toJSON()).toEqual({ _id: testUserIds[i], ...testUsers[i] });
    }
  })

  it('createCodeBundle', async () => {
    testCodeBundleIds = await Promise.all(
      testCodeBundles.map((codeBundle, index) => {
        return q.createCodeBundle(db, testIdentities[index], codeBundle);
      })
    );

    for (let i = 0; i < testCodeBundleIds.length; i++) {
      const document = await q.getCodeBundleCollection(db).findOne({ id: testCodeBundleIds[i] });

      expect(document).toBeTruthy();
      expect(document).toMatchObject({ owner: publicKeyHex(testIdentities[i]), ...testCodeBundles[i] });
    }
  });

  it('createContract', async () => {
    const owners: PrivateKey[] = [];

    testContractAddresses = await Promise.all(
      testContracts.map((contract, index) => {
        const identity = testIdentities[index % TEST_DATA.length]

        owners.push(identity);

        return q.createContract(db, identity, contract);
      })
    );

    for (let i = 0; i < testContractAddresses.length; i++) {
      const document = await q.getContractCollection(db).findOne({ address: testContractAddresses[i] });

      expect(document).toBeTruthy();
      expect(document).toMatchObject({ owner: publicKeyHex(owners[i]), ...testContracts[i] });
    }
  });

  it('findCodeBundleByHash', async () => {
    const { codeHash, blockOneHash } = testCodeBundles[0];

    const result = await q.findCodeBundleByHash(db, { codeHash, blockOneHash });

    expect(result).toBeTruthy();
    expect(result).toMatchObject(testCodeBundles[0]);
  });

  it('findCodeBundleById', async () => {
    const result = await q.findCodeBundleById(db, testCodeBundles[0].id);

    expect(result).toBeTruthy();
    expect(result).toMatchObject(testCodeBundles[0]);
  });

  it('findContractByAddress', async () => {
    const result = await q.findContractByAddress(db, testContracts[0].address);

    expect(result).toBeTruthy();
    expect(result).toMatchObject(testContracts[0]);
  })

  it('findUser', async () => {
    const document = await q.findUser(db, testIdentities[0]);

    expect(document).toBeTruthy();
    expect(document).toEqual({ _id: testUserIds[0], ...testUsers[0] });
  })

  it('updateCodebundle', async () => {
    const updates = getMockUpdates(true);

    // const originalDocument = await q.findCodeBundleById(db, codeBundle.id);

    await q.updateCodeBundle(db, testCodeBundles[0].id, updates);

    const updatedDocument = await q.findCodeBundleById(db, testCodeBundles[0].id);

    expect(updatedDocument).toBeTruthy();
    expect(updatedDocument?.name).toEqual(updates.name);
    expect(updatedDocument?.tags).toEqual(updates.tags);
    expect(updatedDocument?.abi).toMatchObject(updates.abi as Record<string, unknown>);
  })

  it('updateContract', async () => {
    const updates = getMockUpdates();

    // const originalDocument = await q.findCodeBundleById(db, codeBundle.id);

    await q.updateContract(db, testContracts[0].address, updates);

    const updatedDocument = await q.findContractByAddress(db, testContracts[0].address);

    expect(updatedDocument).toBeTruthy();
    expect(updatedDocument?.name).toEqual(updates.name);
    expect(updatedDocument?.tags).toEqual(updates.tags);
  })

  it('starCodeBundle & unstarCodeBundle', async () => {
    let user: UserDocument | null;

    const codeBundle = await q.getCodeBundleCollection(db).findOne({ owner: { $ne: publicKeyHex(testIdentities[0]) }}) as CodeBundleDocument;

    await q.starCodeBundle(db, testIdentities[0], codeBundle.id);

    user = await q.findUser(db, testIdentities[0]);
    
    expect(user?.codeBundlesStarred).toContain(codeBundle.id);

    await q.unstarCodeBundle(db, testIdentities[0], codeBundle.id);

    user = await q.findUser(db, testIdentities[0]);

    expect(user?.codeBundlesStarred).not.toContain(codeBundle.id);
  })

  it('starContract & unstarContract', async () => {
    let user;

    const contract = await q.getContractCollection(db).findOne({ owner: { $ne: publicKeyHex(testIdentities[0]) }}) as ContractDocument;

    await q.starContract(db, testIdentities[0], contract.address);

    user = await q.findUser(db, testIdentities[0]);
    
    expect(user?.contractsStarred).toContain(contract.address);

    await q.unstarContract(db, testIdentities[0], contract.address);

    user = await q.findUser(db, testIdentities[0]);

    expect(user?.contractsStarred).not.toContain(contract.address);
  })

  it('findMyCodeBundles', async () => {
    const ownedCodeBundles = await q.getCodeBundleCollection(db).find({ owner: publicKeyHex(testIdentities[0]) }).toArray();
    const starredCodeBundles = (await q.getCodeBundleCollection(db)
      .find({ owner: { $ne: publicKeyHex(testIdentities[0]) } })
      .toArray())
      .map((document) => ({ isExistent: true, value: document }));

    for (let i = 0; i < starredCodeBundles.length; i += 1) {
      await q.starCodeBundle(db, testIdentities[0], starredCodeBundles[i].value.id);
    }

    const myCodeBundles = await q.findMyCodeBundles(db, testIdentities[0]);

    expect(myCodeBundles).toBeTruthy();
    expect(myCodeBundles).toMatchObject({ owned: ownedCodeBundles, starred: starredCodeBundles });
  })

  it('findMyContracts', async () => {
    const ownedContracts = await q.getContractCollection(db).find({ owner: publicKeyHex(testIdentities[0]) }).toArray();
    const starredContracts = (await q.getContractCollection(db)
      .find({ owner: { $ne: publicKeyHex(testIdentities[0]) } })
      .toArray())
      .map((document) => ({ isExistent: true, value: document }));

    for (let i = 0; i < starredContracts.length; i += 1) {
      await q.starContract(db, testIdentities[0], starredContracts[i].value.address);
    }

    const myCodeBundles = await q.findMyContracts(db, testIdentities[0]);

    expect(myCodeBundles).toBeTruthy();
    expect(myCodeBundles).toMatchObject({ owned: ownedContracts, starred: starredContracts });
  })

  it('removeCodeBundle', async() => {
    const codeBundle = (await q.getCodeBundleCollection(db).findOne({ owner: { $ne: publicKeyHex(testIdentities[0]) }})) as CodeBundleDocument;

    await q.starCodeBundle(db, testIdentities[0], codeBundle.id);

    await q.removeCodeBundle(db, codeBundle.id);

    const missingDocument = await q.findCodeBundleById(db, codeBundle.id);

    expect(missingDocument).not.toBeTruthy();

    const user = await q.findUser(db, testIdentities[0]);
    
    const starredIndex = user?.codeBundlesStarred.findIndex((id) => id === codeBundle.id);

    expect(starredIndex).toBeGreaterThanOrEqual(0);
  
    const myCodeBundles = await q.findMyCodeBundles(db, testIdentities[0]);

    expect(myCodeBundles.starred[starredIndex as number]).toEqual({ isExistent: false, value: { identifier: codeBundle.id } });
  })

  it('removeContract', async() => {
    const contract = (await q.getContractCollection(db).findOne({ owner: { $ne: publicKeyHex(testIdentities[0]) }})) as ContractDocument;

    await q.starContract(db, testIdentities[0], contract.address);

    await q.removeContract(db, contract.address);

    const missingDocument = await q.findContractByAddress(db, contract.address);

    expect(missingDocument).not.toBeTruthy();

    const user = await q.findUser(db, testIdentities[0]);
    
    const starredIndex = user?.contractsStarred.findIndex((address) => address === contract.address);

    expect(starredIndex).toBeGreaterThanOrEqual(0);
  
    const myContracts = await q.findMyContracts(db, testIdentities[0]);

    expect(myContracts.starred[starredIndex as number]).toEqual({ isExistent: false, value: { identifier: contract.address } });
  })
})

afterAll(async () => {
  await db.delete();
})