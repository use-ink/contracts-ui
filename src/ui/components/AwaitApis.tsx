import React, { useEffect, useState } from "react";
import faker from 'faker';
import type { HTMLAttributes } from 'react';
import { BlueprintPromise, CodePromise, ContractPromise } from "@polkadot/api-contract";
import { Keyring } from "@polkadot/ui-keyring";
import { CodeSubmittableResult } from "@polkadot/api-contract/base";
import { useCanvas, useDatabase } from "ui/contexts";
import { useIsMountedRef } from "ui/hooks/useIsMountedRef";
import { createCodeBundle, createContract, getPrivateKeyFromPair, getUser } from "db";
import { AnyJson, CodeBundleDocument, ContractDocument, KeyringPair } from "types";
import { capitalize } from "ui/util";
// import { SubmittableExtrinsic } from "@polkadot/api/types";

const MNEMONICS = ['alice', 'bob', 'charlie', 'dave', 'eve', 'ferdie'];

const MOCK_DATA: [string, number, string[], any[]][] = [
  ['Flipper', 0, ['alpha', 'beta'], [true]],
  ['ERC20', 1, ['alpha', 'beta', 'gamma'], [1000000]],
  ['DNS', 2, ['delta'], []],
  ['Incrementer', 1, ['beta', 'delta', 'gamma'], [7]],
];

function getPair (keyring: Keyring, mnemonic: string): KeyringPair {
  return keyring.getPairs().find(({ meta: { name }}) => name === mnemonic) as KeyringPair;
}

export function AwaitApis ({ children }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  const mountedRef = useIsMountedRef();
  const { api, blockOneHash, status, keyring, keyringStatus, error, systemName } = useCanvas();
  const { db, isDbReady } = useDatabase();
  // const { allAccounts } = useAccounts();

  const isDevelopment = systemName === 'Canvas Node';

  const [isMockDataPopulated, setIsMockDataPopulated] = useState<boolean | null>(null);

  useEffect(
    (): void => {
      async function checkIfMockDataPopulated (): Promise<boolean> {
        const users = await db.collection('User')?.find({}).toArray();

        console.log(users);

        return !!users && users.length > 0;
      }

      if (isDevelopment && isDbReady) {
        checkIfMockDataPopulated()
          .then((isMockDataPopulated): void => {
            console.log(isMockDataPopulated);
            setIsMockDataPopulated(isMockDataPopulated);
          })
          .catch(console.error);
      }
    },
    [isDbReady]
  )

  useEffect(
    (): void => {
      async function populateMockData () {
        const identities = MNEMONICS.map((mnemonic) => {
          return getPrivateKeyFromPair(
            getPair(keyring!, mnemonic),
            'asdfasdf'
          );
        });

        const users = await Promise.all(
          MNEMONICS.map((mnemonic, index) => {
            const firstName = capitalize(mnemonic);
            const lastName = faker.name.lastName();

            return getUser(db, identities[index], { name: `${firstName} ${lastName}`, email: faker.internet.email(firstName, lastName) });
          })
        )

        console.log(users);

        let results: [BlueprintPromise, ContractPromise][];

        let codeBundles: CodeBundleDocument[];

        let contracts: ContractDocument[]

        for (let i = 0; i < MOCK_DATA.length; i += 1) {
          const [contractName, , tags, params] = MOCK_DATA[i];
          const abiJson = require(`../../db/util/testing/contracts/${contractName?.toLowerCase()}.contract.json`) as AnyJson;

          const code = new CodePromise(api!, abiJson, undefined);

          const unsub = await code.tx[code.abi.constructors[0].method]({
            gasLimit: 3000n * 1000000n,
            value: 0
          }, ...(params || []))
            .signAndSend(getPair(keyring!, 'alice'), async ({ status, contract, blueprint }: CodeSubmittableResult<'promise'>) => {
              if ((status.isInBlock || status.isFinalized) && !!blueprint && !!contract) {
                // here we have an additional field in the result, containing the contract
                results[i] = [blueprint, contract];

                codeBundles[i] = await createCodeBundle(
                  db,
                  identities[0],
                  {
                    abi: abiJson,
                    blockOneHash: blockOneHash || undefined,
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
                    name: contractName,
                    tags
                  }
                );

                unsub();
              }
            });
        }
      }

      if (mountedRef.current && !!keyring && isDbReady && status === 'READY' && isDevelopment && isMockDataPopulated === false) {
        populateMockData()
          .then((): void => {
            setIsMockDataPopulated(true);
          })
          .catch(console.error);
      }
    },
    [isDbReady, isMockDataPopulated, keyring, mountedRef, status]
  );

  if (!isDbReady) {
    return <>Initializing database...</>
  }

  if (keyringStatus !== 'READY') {
    return <>Loading accounts...</>
  }

  if (status !== 'READY') {
    return <>Connecting...</>
  }

  if (isDevelopment && !isMockDataPopulated) {
    return <>Populating development database...</>
  }

  if (error) {
    return <>{error}</>;
  }

  return (
    <>
      {children}
    </>
  );
}