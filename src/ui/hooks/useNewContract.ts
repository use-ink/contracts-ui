// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router';
import type { BlueprintSubmittableResult } from 'types';
import { useApi, useDatabase, useInstantiate, useVersion } from 'ui/contexts';
import { ApiTypes } from '@polkadot/api/types';
import { hexToU8a } from '@polkadot/util';
import { decodeAddress } from '@polkadot/keyring';
import { create1, create2, toEthAddress } from 'lib/address';

interface ExtendedBlueprintSubmittableResult<T extends ApiTypes>
  extends BlueprintSubmittableResult<T> {
  contractData?: {
    salt: string;
    data: Uint8Array;
    code: string;
    originIsCaller?: boolean;
  };
}

export function useNewContract() {
  const { db } = useDatabase();
  const navigate = useNavigate();
  const instantiate = useInstantiate();
  const { api } = useApi();
  const { version } = useVersion();

  const {
    data: { accountId, name },
  } = instantiate;

  async function getNonce() {
    try {
      const nonce = await api.call.accountNonceApi.accountNonce(accountId);
      return nonce.toNumber();
    } catch (error) {
      console.error('Error fetching nonce:', error);
      return null;
    }
  }

  return async function ({
    contract,
    contractData,
  }: ExtendedBlueprintSubmittableResult<'promise'>): Promise<void> {
    if (accountId && contract?.abi.json) {
      let calculatedAddress = contract.address.toString();
      // Calculate the expected contract address based on the Rust logic
      if (version === 'v6' && contractData) {
        const { salt, code, data, originIsCaller = false } = contractData;
        const mappedAccount = toEthAddress(decodeAddress(accountId));

        if (salt) {
          // Use CREATE2 if salt is provided
          calculatedAddress = create2(mappedAccount, hexToU8a(code), data, salt);
        } else {
          // Use CREATE1 if no salt is provided
          const nonce = await getNonce();

          if (nonce !== null) {
            const adjustedNonce = originIsCaller ? Math.max(0, nonce - 1) : nonce;
            calculatedAddress = create1(mappedAccount, adjustedNonce - 2);
          }
        }
      }
      const codeHash = contract.abi.info.source.wasmHash.toHex();
      const document = {
        abi: contract.abi.json,
        address: calculatedAddress!,
        codeHash,
        date: new Date().toISOString(),
        name,
      };

      await Promise.all([
        db.contracts.add(document),
        db.codeBundles.get({ codeHash }).then(codeBundle => {
          if (!codeBundle) {
            return db.codeBundles.add(document);
          }
        }),
      ]);

      navigate(`/contract/${document.address}`);
    }
  };
}
