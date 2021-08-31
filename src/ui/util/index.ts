import { twMerge } from 'tailwind-merge';

export const classes = twMerge;

export function capitalize (aString: string): string {
  return `${aString[0].toUpperCase()}${aString.slice(1)}`;
}

export const MNEMONICS = ['alice', 'bob', 'charlie', 'dave', 'eve', 'ferdie'];

export const MOCK_CONTRACT_DATA: [string, number, string[], unknown[]][] = [
  ['Flipper', 0, ['alpha', 'beta'], [true]],
  ['ERC20', 1, ['alpha', 'beta', 'gamma'], [1000000000000n * 1000000n]],
  ['DNS', 2, ['delta'], []],
  ['Incrementer', 1, ['beta', 'delta', 'gamma'], [7]],
];
