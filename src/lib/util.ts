// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import { keyring } from '@polkadot/ui-keyring';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { twMerge } from 'tailwind-merge';

export const classes = twMerge;

export function truncate(value: string | undefined, sideLength = 6): string {
  return value
    ? value.length > sideLength * 2
      ? `${value.substring(0, sideLength)}...${value.substring(value.length - sideLength)}`
      : value
    : '';
}

export function displayDate(isoDateString: string, formatString = 'd MMM'): string {
  return format(parseISO(isoDateString), formatString);
}

export function isValidCodeHash(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value);
}

export function isEmptyObj(value: unknown) {
  return JSON.stringify(value) === '{}';
}
export function randomAsU8a(length = 32) {
  return crypto.getRandomValues(new Uint8Array(length));
}

export const NOOP = (): void => undefined;

export function isValidWsUrl(s: unknown) {
  if (typeof s === 'string') {
    let url;
    try {
      url = new URL(s);
    } catch (_) {
      return false;
    }

    return url.protocol === 'ws:' || url.protocol === 'wss:';
  }
  return false;
}

export const genRanHex: (size?: number) => `0x${string}` = (size = 32) =>
  `0x${[...Array<string>(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isValidAddress(address: string | Uint8Array | null | undefined) {
  try {
    // encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
  } catch (error) {
    return false;
  }
}
