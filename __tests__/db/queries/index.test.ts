/**
 * @jest-environment ./db-test-env
 */
/* eslint-disable header/header */

import { Database, PrivateKey } from '@textile/threaddb';
import { chooseOne } from '@ui/util/testing'
import { getTestUsers, getTestCodeBundles, getTestContracts, getMockUpdates } from '@db/util/testing';
import { initDb } from '@db/util/init'
import { publicKeyHex } from '@db/util/identity';
import * as q from '@db/queries';

import type { CodeBundleDocument, ContractDocument, UserDocument } from '@db/types';

let db: Database;
let testIdentities: PrivateKey[];

let testUsers: UserDocument[];
let testUserIds: string[];

let testCodeBundles: CodeBundleDocument[];
let testCodeBundleIds: string[];

let testContracts: ContractDocument[];
let testContractAddresses: string[];

const USER_COUNT = 4;

beforeAll(
  async (): Promise<void> => {
    db = await initDb('test-db');

    [testUsers, testIdentities] = getTestUsers(USER_COUNT);
    testCodeBundles = getTestCodeBundles();
    testContracts = getTestContracts(testCodeBundles);
  }
)

describe('DB Queries', (): void => {
  it('createUser', async () => {
    testUserIds = await Promise.all(
      testUsers.map((user, index) => {
        return q.createUser(db, testIdentities[index], user);
      })
    );

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
      testContracts.map((codeBundle, index) => {
        let identity;

        if (index < USER_COUNT) {
          identity = testIdentities[index];
        } else {
          [identity] = chooseOne(testIdentities);
        }

        owners.push(identity);

        return q.createContract(db, identity, codeBundle);
      })
    );

    for (let i = 0; i < testContractAddresses.length; i++) {
      const document = await q.getContractCollection(db).findOne({ address: testContractAddresses[i] });

      expect(document).toBeTruthy();
      expect(document).toMatchObject({ owner: publicKeyHex(owners[i]), ...testContracts[i] });
    }
  });

  it('findCodeBundleByHash', async () => {
    const [codeBundle] = chooseOne(testCodeBundles);

    const { codeHash, blockOneHash } = codeBundle;

    const result = await q.findCodeBundleByHash(db, { codeHash, blockOneHash });

    expect(result).toBeTruthy();
    expect(result).toMatchObject(codeBundle);
  });

  it('findCodeBundleById', async () => {
    const [codeBundle] = chooseOne(testCodeBundles);

    const result = await q.findCodeBundleById(db, codeBundle.id);

    expect(result).toBeTruthy();
    expect(result).toMatchObject(codeBundle);
  });

  it('findContractByAddress', async () => {
    const [contract] = chooseOne(testContracts);

    const result = await q.findContractByAddress(db, contract.address);

    expect(result).toBeTruthy();
    expect(result).toMatchObject(contract);
  })

  it('findUser', async () => {
    const [identity, index] = chooseOne(testIdentities);

    const document = await q.findUser(db, identity);

    expect(document).toBeTruthy();
    expect(document).toEqual({ _id: testUserIds[index], ...testUsers[index] });
  })

  it('updateCodebundle', async () => {
    const [codeBundle] = chooseOne(testCodeBundles);

    const updates = getMockUpdates(true);

    // const originalDocument = await q.findCodeBundleById(db, codeBundle.id);

    await q.updateCodeBundle(db, codeBundle.id, updates);

    const updatedDocument = await q.findCodeBundleById(db, codeBundle.id);

    expect(updatedDocument).toBeTruthy();
    expect(updatedDocument?.name).toEqual(updates.name);
    expect(updatedDocument?.tags).toEqual(updates.tags);
    expect(updatedDocument?.abi).toMatchObject(updates.abi as Record<string, unknown>);
  })

  it('updateContract', async () => {
    const [contract] = chooseOne(testContracts);

    const updates = getMockUpdates();

    // const originalDocument = await q.findCodeBundleById(db, codeBundle.id);

    await q.updateContract(db, contract.address, updates);

    const updatedDocument = await q.findContractByAddress(db, contract.address);

    expect(updatedDocument).toBeTruthy();
    expect(updatedDocument?.name).toEqual(updates.name);
    expect(updatedDocument?.tags).toEqual(updates.tags);
  })

  it('starCodeBundle & unstarCodeBundle', async () => {
    let user: UserDocument | null;

    const [identity] = chooseOne(testIdentities);

    const codeBundle = await q.getCodeBundleCollection(db).findOne({ owner: { $ne: publicKeyHex(identity) }}) as CodeBundleDocument;

    await q.starCodeBundle(db, identity, codeBundle.id);

    user = await q.findUser(db, identity);
    
    expect(user?.codeBundlesStarred).toContain(codeBundle.id);

    await q.unstarCodeBundle(db, identity, codeBundle.id);

    user = await q.findUser(db, identity);

    expect(user?.codeBundlesStarred).not.toContain(codeBundle.id);
  })

  it('starContract & unstarContract', async () => {
    let user;

    const [identity] = chooseOne(testIdentities);

    const contract = await q.getContractCollection(db).findOne({ owner: { $ne: publicKeyHex(identity) }}) as ContractDocument;

    await q.starContract(db, identity, contract.address);

    user = await q.findUser(db, identity);
    
    expect(user?.contractsStarred).toContain(contract.address);

    await q.unstarContract(db, identity, contract.address);

    user = await q.findUser(db, identity);

    expect(user?.contractsStarred).not.toContain(contract.address);
  })

  it('findMyCodeBundles', async () => {
    const [identity] = chooseOne(testIdentities);

    const ownedCodeBundles = await q.getCodeBundleCollection(db).find({ owner: publicKeyHex(identity) }).toArray();
    const starredCodeBundles = (await q.getCodeBundleCollection(db)
      .find({ owner: { $ne: publicKeyHex(identity) } })
      .toArray())
      .map((document) => ({ isExistent: true, value: document }));

    for (let i = 0; i < starredCodeBundles.length; i += 1) {
      await q.starCodeBundle(db, identity, starredCodeBundles[i].value.id);
    }

    const myCodeBundles = await q.findMyCodeBundles(db, identity);

    expect(myCodeBundles).toBeTruthy();
    expect(myCodeBundles).toMatchObject({ owned: ownedCodeBundles, starred: starredCodeBundles });
  })

  it('findMyContracts', async () => {
    const [identity] = chooseOne(testIdentities);

    const ownedContracts = await q.getContractCollection(db).find({ owner: publicKeyHex(identity) }).toArray();
    const starredContracts = (await q.getContractCollection(db)
      .find({ owner: { $ne: publicKeyHex(identity) } })
      .toArray())
      .map((document) => ({ isExistent: true, value: document }));

    for (let i = 0; i < starredContracts.length; i += 1) {
      await q.starContract(db, identity, starredContracts[i].value.address);
    }

    const myCodeBundles = await q.findMyContracts(db, identity);

    expect(myCodeBundles).toBeTruthy();
    expect(myCodeBundles).toMatchObject({ owned: ownedContracts, starred: starredContracts });
  })

  it('removeCodeBundle', async() => {
    const [identity] = chooseOne(testIdentities);

    const codeBundle = (await q.getCodeBundleCollection(db).findOne({ owner: { $ne: publicKeyHex(identity) }})) as CodeBundleDocument;

    await q.starCodeBundle(db, identity, codeBundle.id);

    await q.removeCodeBundle(db, codeBundle.id);

    const missingDocument = await q.findCodeBundleById(db, codeBundle.id);

    expect(missingDocument).not.toBeTruthy();

    const user = await q.findUser(db, identity);
    
    const starredIndex = user?.codeBundlesStarred.findIndex((id) => id === codeBundle.id);

    expect(starredIndex).toBeGreaterThanOrEqual(0);
  
    const myCodeBundles = await q.findMyCodeBundles(db, identity);

    expect(myCodeBundles.starred[starredIndex as number]).toEqual({ isExistent: false, value: { identifier: codeBundle.id } });
  })

  it('removeContract', async() => {
    const [identity] = chooseOne(testIdentities);

    const contract = (await q.getContractCollection(db).findOne({ owner: { $ne: publicKeyHex(identity) }})) as ContractDocument;

    await q.starContract(db, identity, contract.address);

    await q.removeContract(db, contract.address);

    const missingDocument = await q.findContractByAddress(db, contract.address);

    expect(missingDocument).not.toBeTruthy();

    const user = await q.findUser(db, identity);
    
    const starredIndex = user?.contractsStarred.findIndex((address) => address === contract.address);

    expect(starredIndex).toBeGreaterThanOrEqual(0);
  
    const myContracts = await q.findMyContracts(db, identity);

    expect(myContracts.starred[starredIndex as number]).toEqual({ isExistent: false, value: { identifier: contract.address } });
  })
})

afterAll(async () => {
  await db.delete();
})