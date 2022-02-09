// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { twMerge } from 'tailwind-merge';

export function classes(...classLists: (string | null | undefined | false)[]) {
  return twMerge(...classLists.map(classList => (!classList ? null : classList)));
}

export function truncate(value: string | undefined, sideLength = 6): string {
  return value
    ? `${value.substring(0, sideLength)}...${value.substring(value.length - sideLength)}`
    : '';
}

export function isValidCodeHash(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value);
}

export function isEmptyObj(value: unknown) {
  return JSON.stringify(value) === '{}';
}

export * from './initValue';
