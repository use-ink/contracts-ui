/**
 * @jest-environment ./db-test-env
 */
// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { Database, PrivateKey } from '@textile/threaddb';
import { chooseOne } from '@common/util/testing'
import { getTestUsers, getTestCodeBundles, getTestContracts } from '@db/util/testing';
import { initDb } from '@db/util/init'
import { publicKeyHex } from '@db/util/identity';
import { createCodeBundle, createContract, createUser, findUser, getCodeBundleCollection, getContractCollection, getUserCollection, starCodeBundle, starContract, unstarCodeBundle, unstarContract } from '@db/queries';

import type { CodeBundleDocument, ContractDocument, UserDocument } from '@db/types';

let db: Database;
let testIdentities: PrivateKey[];

let testUsers: UserDocument[];
let testUserIds: string[];

let testCodeBundles: CodeBundleDocument[];
let testCodeBundleIds: string[];

let testContracts: ContractDocument[];
let testContractAddresses: string[];

const USER_COUNT = 3;

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
        return createUser(db, testIdentities[index], user);
      })
    ) as string[];

    for (let i = 0; i < testUserIds.length; i++) {
      const document = await getUserCollection(db).findById(testUserIds[i]);

      expect(document).toBeTruthy();
      expect(document?.toJSON()).toEqual({ _id: testUserIds[i], ...testUsers[i] });
    }
  })

  it('createCodeBundle', async () => {
    const owners: PrivateKey[] = [];

    testCodeBundleIds = await Promise.all(
      testCodeBundles.map((codeBundle) => {
        const [identity] = chooseOne(testIdentities);

        owners.push(identity);

        return createCodeBundle(db, identity, codeBundle);
      })
    ) as string[];

    for (let i = 0; i < testCodeBundleIds.length; i++) {
      const document = await getCodeBundleCollection(db).findOne({ id: testCodeBundleIds[i] });


      expect(document).toBeTruthy();
      expect(document).toMatchObject({ owner: publicKeyHex(owners[i]), ...testCodeBundles[i] });
    }
  });

  it('createContract', async () => {
    const owners: PrivateKey[] = [];

    testContractAddresses = await Promise.all(
      testContracts.map((codeBundle) => {
        const [identity] = chooseOne(testIdentities);

        owners.push(identity);

        return createContract(db, identity, codeBundle);
      })
    ) as string[];

    for (let i = 0; i < testContractAddresses.length; i++) {
      const document = await getContractCollection(db).findOne({ address: testContractAddresses[i] });

      expect(document).toBeTruthy();
      expect(document).toMatchObject({ owner: publicKeyHex(owners[i]), ...testContracts[i] });
    }
  });

  it('findUser', async () => {
    const [identity, index] = chooseOne(testIdentities);

    const document = await findUser(db, identity);

    expect(document).toBeTruthy();
    expect(document).toEqual({ _id: testUserIds[index], ...testUsers[index] });
  })

  it('starCodeBundle & unstarCodeBundle', async () => {
    let user: UserDocument | null;

    const [identity] = chooseOne(testIdentities);

    const codeBundle = await getCodeBundleCollection(db).findOne({ owner: { $ne: publicKeyHex(identity) }}) as CodeBundleDocument;

    await starCodeBundle(db, identity, codeBundle.id);

    user = await findUser(db, identity);
    
    expect(user?.codeBundlesStarred).toContain(codeBundle.id);

    await unstarCodeBundle(db, identity, codeBundle.id);

    user = await findUser(db, identity);

    expect(user?.codeBundlesStarred).not.toContain(codeBundle.id);
  })

  it('starContract & unstarContract', async () => {
    let user;

    const [identity] = chooseOne(testIdentities);

    const contract = await getContractCollection(db).findOne({ owner: { $ne: publicKeyHex(identity) }}) as ContractDocument;

    await starContract(db, identity, contract.address);

    user = await findUser(db, identity);
    
    expect(user?.contractsStarred).toContain(contract.address);

    await unstarContract(db, identity, contract.address);

    user = await findUser(db, identity);

    expect(user?.contractsStarred).not.toContain(contract.address);
  })
})

afterAll(async () => {
  await db.delete();
})