import { compactAddLength, u8aToU8a } from '@polkadot/util';
import { randomAsU8a } from '@polkadot/util-crypto';
import {
  AnyJson,
  DispatchError,
  Bytes,
  ApiPromise,
  AbiParam,
  Abi,
  ContractPromise,
  KeyringPair,
  AbiMessage,
  DropdownOption,
  BlueprintPromise,
  RegistryError,
} from '../types';

export const handleDispatchError = (dispatchError: DispatchError, api: ApiPromise) => {
  let error: RegistryError | AnyJson | undefined;
  if (dispatchError.isModule) {
    error = api.registry.findMetaError(dispatchError.asModule);
    console.log('Error creating instance: ', error);
  } else {
    error = dispatchError.toHuman();
    console.log(`Error creating instance: ${dispatchError}`);
  }
  return error;
};

export const saveInLocalStorage = (contract: ContractPromise) => {
  const storedInstances = localStorage.getItem('contracts');
  const st = storedInstances ? Array.from(JSON.parse(storedInstances)) : [];
  st.push(contract);
  window.localStorage.setItem('contracts', JSON.stringify(st));
};

export const convertMetadata = (metadata: unknown, api: ApiPromise | null) => {
  return new Abi(metadata as AnyJson, api?.registry.getChainProperties());
};

const EMPTY_SALT = new Uint8Array();

export function encodeSalt(salt: Uint8Array | string | null = randomAsU8a()): Uint8Array {
  return salt instanceof Bytes
    ? salt
    : salt && salt.length
    ? compactAddLength(u8aToU8a(salt))
    : EMPTY_SALT;
}

export function createEmptyValues(args?: AbiParam[]) {
  const o: Record<string, string> = {};
  if (args) {
    args.map(arg => {
      o[arg.name] = '';
    });
  }
  return o;
}
export const createOptions = (keyringPairs: Partial<KeyringPair>[]): DropdownOption<string>[] =>
  keyringPairs.map(pair => ({
    value: pair.address || '',
    name: (pair.meta?.name as string).toUpperCase() || '',
  }));

export const createValuesHash = (codeHashes: string[]): DropdownOption<string>[] => {
  return codeHashes.map(h => ({ name: h, value: h }));
};
export const createOptionsConstructor = (constructors: AbiMessage[]): DropdownOption<number>[] => {
  return constructors.map((c, index) => ({ name: c.identifier, value: index }));
};
export function createTx(
  namespace: ContractPromise | BlueprintPromise,
  method: AbiMessage,
  args: string[],
  options: { gasLimit: number; salt?: Uint8Array; value: number }
) {
  return method.args.length > 0
    ? namespace.tx[method.identifier](options, ...args)
    : namespace.tx[method.identifier](options);
}
