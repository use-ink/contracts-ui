import { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise, Abi } from '../../types';

export const createContract = (
  api: ApiPromise | null,
  metadata?: Abi,
  address?: string
): ContractPromise | undefined => {
  let contract: ContractPromise | undefined;
  if (address && api && metadata) {
    contract = new ContractPromise(api, metadata, address);
  }
  return contract;
};
