import { twMerge } from 'tailwind-merge';

export function classes (...classLists: (string | null | undefined | false)[]) {
  return twMerge(...classLists.map((classList) => !classList ? null : classList));
}

export const MOCK_CONTRACT_DATA: [string, number, string[], unknown[]][] = [
  ['Flipper', 0, ['alpha', 'beta'], [true]],
  ['ERC20', 1, ['alpha', 'beta', 'gamma'], [1000000000000n * 1000000n]],
  ['DNS', 2, ['delta'], []],
  ['Incrementer', 1, ['beta', 'delta', 'gamma'], [7]],
];

export * from './initValue';


