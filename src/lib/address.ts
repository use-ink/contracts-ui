// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ethers } from 'ethers';
import { stringToU8a, u8aToHex } from '@polkadot/util';

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
