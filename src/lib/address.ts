// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BigNumberish, ethers } from 'ethers';
import { hexToU8a, stringToU8a, u8aToHex } from '@polkadot/util';
import { keccak256 } from 'ethers';

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
export function create1(deployer: string, nonce: number): Address {
  // Convert deployer to bytes (remove 0x prefix if present)
  const deployerBytes = ethers.hexlify(deployer);
  ethers.toBeHex(nonce as BigNumberish);
  // Convert nonce to hex (minimal encoding)
  const nonceBytes = ethers.toBeHex(nonce as BigNumberish);

  // RLP encode [deployer, nonce]
  const encodedData = ethers.encodeRlp([deployerBytes, nonceBytes]);

  // Calculate keccak256 hash of the RLP encoded data
  const hash = ethers.keccak256(encodedData);

  // Take the last 20 bytes (40 hex chars + 0x prefix)
  return ethers.getAddress('0x' + hash.substring(26));
}

/**
 * Determine the address of a contract using CREATE2 semantics.
 * @param deployer The address of the deployer
 * @param code The contract code (WASM or EVM bytecode)
 * @param inputData The constructor arguments or init input
 * @param salt A 32-byte salt value (as hex string)
 * @returns The deterministic contract address
 */
export function create2(
  deployer: string,
  code: Uint8Array,
  inputData: Uint8Array,
  salt: string,
): Address {
  const initCode = new Uint8Array([...code, ...inputData]);
  const initCodeHash = hexToU8a(keccak256(initCode));

  const parts = new Uint8Array(1 + 20 + 32 + 32); // 0xff + deployer + salt + initCodeHash
  parts[0] = 0xff;
  parts.set(hexToU8a(deployer), 1);
  parts.set(hexToU8a(salt), 21);
  parts.set(initCodeHash, 53);

  const hash = keccak256(parts);

  // Return last 20 bytes as 0x-prefixed hex string
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

export function isEthAddress(addr: string): boolean {
  const hex = addr.startsWith('0x') ? addr.slice(2) : addr;
  return hex.length === 40;
}

export function fromEthAddress(ethAddress: string): string {
  // Remove '0x' prefix if it exists
  const cleanAddress = ethAddress.startsWith('0x') ? ethAddress.slice(2) : ethAddress;

  // Convert the hex string to bytes
  const addressBytes = Buffer.from(cleanAddress, 'hex');

  // Check if the address is the expected length (20 bytes)
  if (addressBytes.length !== 20) {
    throw new Error('Invalid Ethereum address: must be 20 bytes');
  }

  // Create a 32-byte buffer
  const result = new Uint8Array(32).fill(0xee);

  // Set the first 20 bytes to the Ethereum address
  result.set(addressBytes, 0);

  return u8aToHex(result);
}

/**
 * Determines if an account ID is derived from an Ethereum address
 * @param accountId The account ID bytes
 * @returns True if the account is derived from an Ethereum address
 */
export function isEthDerived(accountId: Uint8Array): boolean {
  if (accountId.length >= 32) {
    return accountId[20] === 0xee && accountId[21] === 0xee;
  }
  return false;
}
