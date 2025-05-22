import { TypeRegistry } from '@polkadot/types';
const registry = new TypeRegistry();
const instantiateWithCode = () => {
  throw new Error('mock');
};
instantiateWithCode.meta = { args: new Array(6) };
export const mockApi = {
  call: {
    contractsApi: {
      call: () => {
        throw new Error('mock');
      },
    },
  },
  isConnected: true,
  registry,
  tx: {
    contracts: {
      instantiateWithCode,
    },
  },
};
