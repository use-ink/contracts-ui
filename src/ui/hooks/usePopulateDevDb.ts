
import { useCallback, useEffect, useState } from "react";
import faker from 'faker';
import { CodePromise } from "@polkadot/api-contract";
import type { Keyring } from "@polkadot/ui-keyring";
import type { Blueprint, BlueprintSubmittableResult, CodeSubmittableResult } from "@polkadot/api-contract/base";
import type { Database, PrivateKey } from "@textile/threaddb";
import { useCanvas, useDatabase } from "ui/contexts";
import { useIsMountedRef } from "ui/hooks/useIsMountedRef";
import { createCodeBundle, createContract, dropExpiredDocuments, getCodeBundleCollection, getContractCollection, getPrivateKeyFromPair, getUser, getUserCollection, starCodeBundle, starContract } from "db";
import type { AnyJson, ApiPromise, CodeBundleDocument, KeyringPair, UserDocument } from "types";
import { capitalize, MOCK_CONTRACT_DATA, MNEMONICS } from "ui/util";

function chooseOne<T>(items: T[]): [T, number] {
  const index = Math.floor(Math.random()*items.length);

  return [items[index], index];
}

function getPair (keyring: Keyring, mnemonic: string): KeyringPair {
  return keyring.getPairs().find(({ meta: { name }}) => name === mnemonic) as KeyringPair;
}

export function usePopulateDevDb (): boolean | null {
  const mountedRef = useIsMountedRef();
  const { api, endpoint, blockOneHash, status, keyring, systemName } = useCanvas();
  const { db, isDbReady } = useDatabase();
  // const { allAccounts } = useAccounts();

  const isDevelopment = systemName === 'Canvas Node' && /(127\.0\.0\.1|localhost)/.test(endpoint);

  const [deploymentsLeft, setDeploymentsLeft] = useState(isDevelopment ? MOCK_CONTRACT_DATA.length : 0);
  const [redeploymentsLeft, setRedeploymentsLeft] = useState(isDevelopment ? MNEMONICS.length : 0);
  const [needsMockData, setNeedsMockData] = useState<boolean | null>(null);
  const [mockCodeBundles, setMockCodeBundles] = useState<CodeBundleDocument[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint<'promise'>[]>([]);
  const [mockUsers, setMockUsers] = useState<[UserDocument, PrivateKey][]>([]);

  const checkIfNeedsMockData = useCallback(
    async (api: ApiPromise, db: Database, blockOneHash: string): Promise<boolean> => {
      if (!isDevelopment) {
        return false;
      }

      await dropExpiredDocuments(db, blockOneHash);

      const validCodeBundles = !!blockOneHash && (await getCodeBundleCollection(db).find({ blockOneHash }).toArray());

      const isCodeOnChain = validCodeBundles && validCodeBundles.length > 0 && (await api.query.contracts.codeStorage(validCodeBundles[0].codeHash)).isSome;

      return !isCodeOnChain;
    },
    []
  );

  const deployContracts = useCallback(
    async (api: ApiPromise, keyring: Keyring) => {
      await getUserCollection(db).clear();

      const mockUsers = await Promise.all(
        MNEMONICS.map(
          async (mnemonic): Promise<[UserDocument, PrivateKey]> => {
            const firstName = capitalize(mnemonic);
            const lastName = faker.name.lastName();

            const identity = getPrivateKeyFromPair(
              getPair(keyring, mnemonic),
              'asdfasdf'
            );
            const user = await getUser(db, identity, { name: `${firstName} ${lastName}`, email: faker.internet.email(firstName, lastName) });

            return Promise.resolve([user as UserDocument, identity]);
          }
        ));

      setMockUsers(mockUsers);

      console.log('Deploying development smart contracts...')

      await Promise.all(
        MOCK_CONTRACT_DATA.map(async ([contractName, , tags, params], i) => {
          // eslint-disable-next-line
          const abiJson = require(`../../../test-utils/contracts/${contractName?.toLowerCase()}.contract.json`) as AnyJson;

          const code = new CodePromise(api, abiJson, undefined);

          const unsub = await code.tx.new({
            gasLimit: 60000n * 1000000n,
            value: 1000000000n * 1000000n,
          }, ...(params || []))
            .signAndSend(getPair(keyring, MNEMONICS[i]), async ({ status, contract, blueprint }: CodeSubmittableResult<'promise'>) => {
              if ((status.isInBlock || status.isFinalized) && !!blueprint && !!contract) {
                console.log(`Successfully deployed ${contractName}`);
                // here we have an additional field in the result, containing the contract
                
                setBlueprints((blueprints) => {
                  if (blueprints) blueprints[i] = blueprint;

                  return blueprints;
                })

                unsub();

                const codeBundle = await createCodeBundle(
                  db,
                  mockUsers[i][1],
                  {
                    abi: abiJson,
                    blockOneHash: blockOneHash || undefined,
                    codeHash: blueprint.codeHash.toHex(),
                    genesisHash: api?.genesisHash.toString(),
                    name: contractName,
                    tags
                  }
                );

                setMockCodeBundles(
                  (mockCodeBundles) => {
                    if (mockCodeBundles) mockCodeBundles[i] = codeBundle;

                    return mockCodeBundles;
                  }
                );

                await createContract(
                  db,
                  mockUsers[i][1],
                  {
                    abi: abiJson,
                    address: contract.address.toString(),
                    blockOneHash: blockOneHash || undefined,
                    codeBundleId: codeBundle.id,
                    genesisHash: api?.genesisHash.toString(),
                    name: `${contractName} 1`,
                    tags
                  }
                );

                setDeploymentsLeft((deploymentsLeft) => deploymentsLeft - 1);
              }
            });

          return unsub;
        })
      )
    },
    []
  )

  const redeployContracts = useCallback(
    async (api: ApiPromise, keyring: Keyring) => {
      const contractCounters = MOCK_CONTRACT_DATA.map(() => 1);

      !!mockCodeBundles && await Promise.all(
        MNEMONICS.map(async (mnemonic, i) => {
          const pair = getPair(keyring, mnemonic);

          const [blueprint, codeIndex] = chooseOne(blueprints);
          const [contractName, , tags, params] = MOCK_CONTRACT_DATA[codeIndex];
          const { abi, id } = mockCodeBundles[codeIndex];

          const unsub = blueprint.tx.new({
            gasLimit: 60000n * 1000000n,
            value: 1000000000n * 1000000n,
          }, ...(params || []))
            .signAndSend(pair, {}, async ({ status, contract }: BlueprintSubmittableResult<'promise'>) => {
              if ((status.isInBlock || status.isFinalized) && !!blueprint && !!contract) {
                console.log(`Successfully redeployed ${contractName}`);

                contractCounters[codeIndex] += 1;

                await createContract(
                  db,
                  mockUsers[i][1],
                  {
                    abi,
                    address: contract.address.toString(),
                    blockOneHash: blockOneHash || undefined,
                    codeBundleId: id,
                    genesisHash: api?.genesisHash.toString(),
                    name: `${contractName} ${contractCounters[codeIndex]}`,
                    tags
                  }
                );

                setRedeploymentsLeft((redeploymentsLeft) => redeploymentsLeft - 1);
              }
            });

          return unsub;
        })
      )
    },
    [blueprints, mockCodeBundles, mockUsers]
  );

  const finalizeSetup = useCallback(
    async (db: Database): Promise<void> => {
      for (let i = 0; i < mockUsers.length; i++) {
        const [{ publicKey }, identity] = mockUsers[i];

        const codeBundles = await getCodeBundleCollection(db).find({ owner: { $ne: publicKey } }).toArray();
        const contracts = await getContractCollection(db).find({ owner: { $ne: publicKey } }).toArray();

        for (let j = 0; j < codeBundles.length; j++) {
          if (Math.floor(Math.random() * 2) === 0) {
            await starCodeBundle(db, identity, codeBundles[j].id)
          }
        }

        for (let k = 0; k < contracts.length; k++) {
          if (Math.floor(Math.random() * 2) === 0) {
            await starContract(db, identity, contracts[k].address)
          }
        }
      }

      setNeedsMockData(false);
    },
    [mockUsers]
  )


  useEffect(
    (): () => void => {
      if (mountedRef.current && !!blockOneHash && !!api && !!keyring && isDbReady && status === 'READY' && isDevelopment) {
        needsMockData === null && checkIfNeedsMockData(api, db, blockOneHash)
          .then((needsMockData) => {
            if (needsMockData) {
              setDeploymentsLeft(MOCK_CONTRACT_DATA.length);
              setRedeploymentsLeft(MNEMONICS.length);
              setNeedsMockData(true);
              deployContracts(api, keyring)
                .then()
                .catch(console.error);
            } else {
              setNeedsMockData(false);
            }
          })
          .catch(console.error);
      }

      return (): void => {
        // db.delete().then().catch(console.error);
      }
    },
    [api, endpoint, isDbReady, needsMockData, keyring, mountedRef, status]
  );

  useEffect(
    (): void => {
      if (!!api && !!keyring && deploymentsLeft === 0) {
        redeployContracts(api, keyring).then().catch(console.error);
      }
    },
    [api, deploymentsLeft]
  );

  useEffect(
    (): void => {
      if (!!db && redeploymentsLeft === 0) {
        finalizeSetup(db).then().catch(console.error);
      }
    },
    [db, redeploymentsLeft]
  );

  return needsMockData;
}