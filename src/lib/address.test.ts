// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { describe, expect, it } from 'vitest';
import { getAddress } from 'ethers';
import { decodeAddress } from '@polkadot/keyring';
import { toEthAddress } from './address';

// Similar to pallet_revive tests: https://github.com/paritytech/polkadot-sdk/blob/65ade498b63bf2216d1c444f28c1b48085417f13/substrate/frame/revive/src/address.rs#L257
describe('address utilities', () => {
  it('should convert Substrate account ID to Ethereum address', () => {
    const accountId = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
    const ethAddress = toEthAddress(decodeAddress(accountId));

    expect(ethAddress.startsWith('0x')).toBe(true);
    expect(getAddress(ethAddress)).toBe(getAddress('0x9621dde636de098b43efb0fa9b61facfe328f99d'));
  });
});
