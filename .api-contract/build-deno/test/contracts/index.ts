import ink from './ink/index.ts';
import solang from './solang/index.ts';
import user from './user/index.ts';

const all: Record<string, Record<string, unknown>> = {};

Object.entries({ ink, solang, user }).forEach(([type, abis]) =>
  Object.entries(abis).forEach(([name, abi]): void => {
    all[`${type}_${name}`] = abi;
  }),
);

export default all;
