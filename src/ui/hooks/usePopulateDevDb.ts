
import { useEffect, useState } from "react";
import faker from 'faker';
import { BlueprintPromise, CodePromise, ContractPromise } from "@polkadot/api-contract";
import type { Keyring } from "@polkadot/ui-keyring";
import type { CodeSubmittableResult } from "@polkadot/api-contract/base";
import type { Database } from "@textile/threaddb";
import type { CodecArg } from "@polkadot/types/types";
import { useCanvas, useDatabase } from "ui/contexts";
import { useIsMountedRef } from "ui/hooks/useIsMountedRef";
import { createCodeBundle, createContract, dropExpiredDocuments, getCodeBundleCollection, getPrivateKeyFromPair, getUser, getUserCollection } from "db";
import type { AnyJson, ApiPromise, CodeBundleDocument, ContractDocument, KeyringPair } from "types";
import { capitalize } from "ui/util";

const MNEMONICS = ['alice', 'bob', 'charlie', 'dave', 'eve', 'ferdie'];

const MOCK_DATA: [string, number, string[], CodecArg[]][] = [
  ['Flipper', 0, ['alpha', 'beta'], [true]],
  ['ERC20', 1, ['alpha', 'beta', 'gamma'], [1000000000000n * 1000000n]],
  ['DNS', 2, ['delta'], []],
  ['Incrementer', 1, ['beta', 'delta', 'gamma'], [7]],
];

function getPair (keyring: Keyring, mnemonic: string): KeyringPair {
  return keyring.getPairs().find(({ meta: { name }}) => name === mnemonic) as KeyringPair;
}

export function usePopulateDevDb (): boolean | null {
  const mountedRef = useIsMountedRef();
  const { api, endpoint, blockOneHash, status, keyring, systemName } = useCanvas();
  const { db, isDbReady } = useDatabase();
  // const { allAccounts } = useAccounts();

  const isDevelopment = systemName === 'Canvas Node' && endpoint.includes('127.0.0.1');

  const [transactionsLeft, setTransactionsLeft] = useState(isDevelopment ? MOCK_DATA.length : 0);
  const [needsMockData, setNeedsMockData] = useState<boolean | null>(null);

  useEffect(
    (): () => void => {
      async function checkIfNeedsMockData (api: ApiPromise, db: Database, blockOneHash: string): Promise<boolean> {
        if (!isDevelopment) {
          return false;
        }

        await dropExpiredDocuments(db, blockOneHash);

        const validCodeBundles = !!blockOneHash && (await getCodeBundleCollection(db).find({ blockOneHash }).toArray());
  
        const isCodeOnChain = validCodeBundles && validCodeBundles.length > 0 && (await api.query.contracts.codeStorage(validCodeBundles[0].codeHash)).isSome;

        return !isCodeOnChain;
      }

      async function populateMockData (api: ApiPromise, keyring: Keyring) {
        await getUserCollection(db).clear();

        const identities = MNEMONICS.map((mnemonic) => {
          return getPrivateKeyFromPair(
            getPair(keyring, mnemonic),
            'asdfasdf'
          );
        });

        await Promise.all(
          MNEMONICS.map((mnemonic, index) => {
            const firstName = capitalize(mnemonic);
            const lastName = faker.name.lastName();

            return getUser(db, identities[index], { name: `${firstName} ${lastName}`, email: faker.internet.email(firstName, lastName) });
          })
        )

        const results: [BlueprintPromise, ContractPromise][] = [];

        const codeBundles: CodeBundleDocument[] = [];

        const contracts: ContractDocument[] = [];

        const alice = getPair(keyring, 'alice');
        const nonce = await api.rpc.system.accountNextIndex(alice.address);

        await Promise.all(
          MOCK_DATA.map(async ([contractName, , tags, params], i) => {
            const abiJson = require(`../../db/util/testing/contracts/${contractName?.toLowerCase()}.contract.json`) as AnyJson;

            const code = new CodePromise(api, abiJson, undefined);

            const unsub = await code.tx.new({
              gasLimit: 60000n * 1000000n,
              value: 1000000000n * 1000000n,
            }, ...(params || []))
              .signAndSend(alice, { nonce: nonce.addn(i) }, async ({ status, contract, blueprint }: CodeSubmittableResult<'promise'>) => {
                if ((status.isInBlock || status.isFinalized) && !!blueprint && !!contract) {
                  console.log(`Successfully deployed ${contractName}`);
                  // here we have an additional field in the result, containing the contract
                  results[i] = [blueprint, contract];

                  unsub();

                  codeBundles[i] = await createCodeBundle(
                    db,
                    identities[0],
                    {
                      abi: abiJson,
                      blockOneHash: blockOneHash || undefined,
                      codeHash: blueprint.codeHash.toHex(),
                      genesisHash: api?.genesisHash.toString(),
                      name: contractName,
                      tags
                    }
                  );

                  contracts[i] = await createContract(
                    db,
                    identities[0],
                    {
                      abi: abiJson,
                      address: contract.address.toString(),
                      blockOneHash: blockOneHash || undefined,
                      codeBundleId: codeBundles[i].id,
                      genesisHash: api?.genesisHash.toString(),
                      name: `${contractName} 1`,
                      tags
                    }
                  );

                  setTransactionsLeft((transactionsLeft) => transactionsLeft - 1);
                }
              });

            return unsub;
          })
        )
      }

      if (mountedRef.current && !!blockOneHash && !!api && !!keyring && isDbReady && status === 'READY' && isDevelopment) {
        needsMockData === null && checkIfNeedsMockData(api, db, blockOneHash)
          .then((needsMockData) => {
            if (needsMockData) {
              setNeedsMockData(true);
              populateMockData(api, keyring)
                .then()
                .catch(console.error);
            } else {
              setNeedsMockData(false);
            }
          })
          .catch(console.error);
        
        // populateMockData(api, keyring)
        //   .then((): void => {
        //     setIsMockDataPopulated(true);
        //   })
        //   .catch(console.error);
      }

      return (): void => {
        // db.delete().then().catch(console.error);
      }
    },
    [api, endpoint, isDbReady, needsMockData, keyring, mountedRef, status]
  );

  useEffect(
    (): void => {
      if (transactionsLeft === 0) {
        setNeedsMockData(false);
      }
    },
    [transactionsLeft]
  );

  console.log(needsMockData);
  return needsMockData;
}