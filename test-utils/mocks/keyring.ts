// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import crypto from 'crypto';
import faker from 'faker';
import { keyring } from '@polkadot/ui-keyring';

import type { KeyringPair } from 'types';

keyring.loadAll({ isDevelopment: true });

export const mockKeyring = keyring;

export const mockInvalidAddress = '15QbBVsKoTnshpY7tvntziYYSTD2FyUR15xPiMdpkpJDUygh';

export function getKeyringPairRandom(): KeyringPair {
  return mockKeyring.createFromUri(faker.name.firstName());
}

export function getSecretRandom(): string {
  return crypto.randomBytes(8).toString('hex');
}
