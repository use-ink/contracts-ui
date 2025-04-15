// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router';
import type { BlueprintSubmittableResult } from 'types';
import { useApi, useDatabase, useInstantiate } from 'ui/contexts';
import { ethers } from 'ethers';
import { ApiTypes } from '@polkadot/api/types';
import { stringToU8a } from '@polkadot/util';
import { keccak256 } from 'ethers';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';

interface ExtendedBlueprintSubmittableResult<T extends ApiTypes>
  extends BlueprintSubmittableResult<T> {
  contractData?: {
    salt: Uint8Array;
    data: string;
    code: Uint8Array;
    originIsCaller?: boolean;
  };
}

/**
 * TypeScript equivalent of H160 (20-byte Ethereum address)
 */
type Address = string;

/**
 * Determine the address of a contract using CREATE semantics.
 * @param deployer The address of the deployer
 * @param nonce The nonce value
 * @returns The contract address
 */
export function create1(deployer: Address, nonce: bigint | number): Address {
  // Normalize the deployer address
  const deployerAddress = ethers.getAddress(deployer);

  // Create RLP encoding of the deployer address and nonce
  const encodedData = ethers.encodeRlp([deployerAddress, ethers.toBeHex(nonce)]);

  // Calculate keccak256 hash of the RLP encoded data
  const hash = ethers.keccak256(encodedData);

  // Take the last 20 bytes (40 hex chars + 0x prefix)
  return ethers.getAddress('0x' + hash.substring(26));
}

// /**
//  * Determine the address of a contract using the CREATE2 semantics.
//  * @param deployer The address of the deployer
//  * @param code The initialization code
//  * @param inputData Additional input data
//  * @param salt A 32-byte salt value
//  * @returns The contract address
//  */
// export function create2(
//   deployer: Address,
//   code: Uint8Array | string,
//   inputData: Uint8Array | string,
//   salt: string
// ): Address {
//   console.log("info");
//   console.log(code);
//   console.log("data");
//   console.log(inputData);
//   console.log("salt");
//   console.log(salt);
//
//   // Normalize inputs to Uint8Array
//   const codeBytes = typeof code === 'string'
//     ? stringToU8a(code)
//     : code;
//
//   const inputDataBytes = typeof inputData === 'string'
//     ? stringToU8a(inputData)
//     : inputData;
//
//   const normalizedSalt = stringToU8a(salt.substring(2));
//
//   // Concatenate code and input data
//   const initCode = new Uint8Array(codeBytes.length + inputDataBytes.length);
//   initCode.set(codeBytes);
//   initCode.set(inputDataBytes, codeBytes.length);
//
//   // Calculate init code hash
//   const initCodeHash = ethers.keccak256(initCode);
//
//   // Build the input buffer: 0xff + deployer + salt + initCodeHash
//   const buffer = ethers.concat([
//     new Uint8Array([0xff]),
//     ethers.getBytes(deployer),
//     ethers.getBytes(normalizedSalt),
//     ethers.getBytes(initCodeHash)
//   ]);
//
//   // Calculate keccak256 hash of the buffer
//   const hash = ethers.keccak256(buffer);
//
//   // Take the last 20 bytes (40 hex chars + 0x prefix)
//   return ethers.getAddress("0x" + hash.substring(26));
// }

// function create2(deployer: Address, code: Uint8Array, input_data: Uint8Array, salt: Uint8Array): Address {
//   const init_code = Uint8Array.from([...code, ...input_data]);
//   const init_code_hash = keccak256(init_code);
//   const bytes = new Uint8Array(85);
//   bytes[0] = 0xff;
//   bytes.set(stringToU8a(deployer.toString()), 1);
//   console.log(salt);
//   console.log(salt.length);
//   bytes.set(salt.slice(0, 32), 21);
//   console.log(init_code_hash.length);
//   bytes.set(stringToU8a(init_code_hash.substring(2)), 53);
//   const hash = stringToU8a(keccak256(bytes).substring(2));
//   const addressBytes = hash.slice(12);
//   // const address = new (addressBytes);
//   console.log("addressBytes");
//   console.log(addressBytes);
//   console.log(addressBytes.toString());
//   return addressBytes.toString();
// }

export function create2(
  deployer: string,
  code: Uint8Array,
  inputData: Uint8Array,
  salt: Uint8Array,
): string {
  // if (salt.length !== 32) {
  //   throw new Error('Salt must be 32 bytes');
  // }

  const initCode = new Uint8Array([...code, ...inputData]);
  const initCodeHash = stringToU8a(keccak256(initCode));

  const parts = new Uint8Array(1 + (20 + 32 + 32) * 2); // 0xff + deployer + salt + initCodeHash
  parts[0] = 0xff;
  parts.set(stringToU8a(deployer.slice(2)), 1);
  console.log('HERE');
  console.log(initCodeHash);
  parts.set(salt.slice(2), 21);
  parts.set(initCodeHash.slice(2), 53);

  const hash = keccak256(parts);

  // Return last 20 bytes as 0x-prefixed hex string
  // return '0x' + Buffer.from(hash.slice(12, 42)).toString('hex');
  console.log(hash);
  console.log(hash.toString());
  return ethers.getAddress('0x' + hash.substring(26));
}

/**
 * Converts an account ID to an Ethereum address (H160)
 * @param accountId The account ID bytes
 * @returns The Ethereum address
 */
export function toEthAddress(accountId: Uint8Array | string): string {
  // Convert string input to Uint8Array if needed
  const accountBytes = typeof accountId === 'string' ? stringToU8a(accountId) : accountId;

  // Create a 32-byte buffer and copy account bytes into it
  const accountBuffer = new Uint8Array(32);
  accountBuffer.set(accountBytes.slice(0, 32));

  if (isEthDerived(accountBytes)) {
    // This was originally an eth address
    // We just strip the 0xEE suffix to get the original address
    return '0x' + Buffer.from(accountBuffer.slice(0, 20)).toString('hex');
  } else {
    // This is an (ed|sr)25519 derived address
    // Avoid truncating the public key by hashing it first
    const accountHash = ethers.keccak256(accountBuffer);
    return ethers.getAddress('0x' + accountHash.slice(2 + 24, 2 + 24 + 40)); // Skip '0x' prefix, then skip 12 bytes, take 20 bytes
  }
}

/**
 * Determines if an account ID is derived from an Ethereum address
 * @param accountId The account ID bytes
 * @returns True if the account is derived from an Ethereum address
 */
function isEthDerived(accountId: Uint8Array): boolean {
  if (accountId.length >= 32) {
    return accountId[20] === 0xee && accountId[21] === 0xee;
  }
  return false;
}

export function useNewContract() {
  const { db } = useDatabase();
  const navigate = useNavigate();
  const instantiate = useInstantiate();
  const { api } = useApi();

  console.log('Instantiate', instantiate);

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
    console.log('Processing contract submission');
    console.log(contract);
    console.log(contractData);
    console.log(contractData?.code.toString());

    if (accountId && contract?.abi.json) {
      // Calculate the expected contract address based on the Rust logic
      let calculatedAddress;

      if (contractData) {
        const { salt, code, data, originIsCaller = false } = contractData;
        const mappedAccount = toEthAddress(decodeAddress(accountId));
        console.log('Mapped account address:', mappedAccount);
        console.log(mappedAccount);

        if (salt) {
          // Use CREATE2 if salt is provided
          calculatedAddress = create2(mappedAccount, code, data, salt);
          console.log('CREATE2 calculated address:', calculatedAddress);
        } else {
          // Use CREATE1 if no salt is provided
          const nonce = await getNonce();

          if (nonce !== null) {
            const adjustedNonce = originIsCaller ? Math.max(0, nonce - 1) : nonce;
            calculatedAddress = create1(mappedAccount, BigInt(adjustedNonce));
            console.log('CREATE1 calculated address with nonce:', adjustedNonce);
            console.log('Calculated address:', calculatedAddress);
          }
        }
      }

      const codeHash = contract.abi.info.source.wasmHash.toHex();

      const document = {
        abi: contract.abi.json,
        address: calculatedAddress,
        codeHash,
        date: new Date().toISOString(),
        name,
        // Store the calculated address
        calculatedAddress: calculatedAddress || undefined,
      };

      await Promise.all([
        db.contracts.add(document),
        db.codeBundles.get({ codeHash }).then(codeBundle => {
          if (!codeBundle) {
            return db.codeBundles.add(document);
          }
        }),
      ]);

      navigate(`/contract/${contract.address}`);
    }
  };
}
