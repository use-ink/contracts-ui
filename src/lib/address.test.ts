// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { hexToU8a } from '@polkadot/util';
import { beforeAll, describe, expect, it } from 'vitest';
import { getAddress } from 'ethers';
import { decodeAddress } from '@polkadot/keyring';
import { create1, create2, toEthAddress, isEthAddress } from './address';

// Similar to pallet_revive tests: https://github.com/paritytech/polkadot-sdk/blob/65ade498b63bf2216d1c444f28c1b48085417f13/substrate/frame/revive/src/address.rs#L257
describe('address utilities', () => {
  const deployer = '0x' + '01'.repeat(20);
  const code = Uint8Array.from([0x60, 0x00, 0x60, 0x00, 0x55, 0x60, 0x01, 0x60, 0x00]);
  const inputData = Uint8Array.from([0x55]);
  const salt = '0x1234567890123456789012345678901234567890123456789012345678901234';

  it('should compute correct address with create1', () => {
    const address = create1(deployer, 1);
    expect(getAddress(address)).toBe(getAddress('0xc851da37e4e8d3a20d8d56be2963934b4ad71c3b'));
  });

  it('should compute correct address with create2', () => {
    const address = create2(deployer, code, inputData, salt);
    expect(getAddress(address)).toBe(getAddress('0x7f31e795e5836a19a8f919ab5a9de9a197ecd2b6'));
  });

  it('should convert Substrate account ID to Ethereum address', () => {
    const accountId = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
    const ethAddress = toEthAddress(decodeAddress(accountId));

    expect(ethAddress.startsWith('0x')).toBe(true);
    expect(getAddress(ethAddress)).toBe(getAddress('0x9621dde636de098b43efb0fa9b61facfe328f99d'));
  });

  it('should detect if is Ethereum address', () => {
    const ethAddress = '0x9621dde636de098b43efb0fa9b61facfe328f99d';
    expect(isEthAddress(ethAddress), true);

    const accountId = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
    expect(isEthAddress(ethAddress), false);
  });
});
