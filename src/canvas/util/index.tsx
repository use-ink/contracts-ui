// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';
import BN from 'bn.js';
import {
  compactAddLength,
  u8aToU8a,
  hexToU8a,
  isHex,
  u8aToString,
  isNumber,
  BN_TEN,
} from '@polkadot/util';
import { createTypeUnsafe } from '@polkadot/types';
import { randomAsU8a } from '@polkadot/util-crypto';
import {
  Abi,
  AbiConstructor,
  Bytes,
  Codec,
  ContractPromise,
  AnyJson,
  DispatchError,
  ApiPromise,
  AbiParam,
  KeyringPair,
  AbiMessage,
  DropdownOption,
  Registry,
  Raw,
  TypeDef,
} from 'types';
import { MessageSignature } from 'ui/components/MessageSignature';

export function handleDispatchError(dispatchError: DispatchError, api: ApiPromise): void {
  if (dispatchError.isModule) {
    const decoded = api.registry.findMetaError(dispatchError.asModule);
    console.error('Error sending transaction: ', decoded);
  } else {
    console.error(`Error sending transaction: ${dispatchError}`);
  }
}

export const saveInLocalStorage = (contract: ContractPromise) => {
  const storedInstances = localStorage.getItem('contracts');
  const st = storedInstances ? Array.from(JSON.parse(storedInstances)) : [];
  st.push(contract);
  window.localStorage.setItem('contracts', JSON.stringify(st));
};

export const getInstancesFromStorage = () => {
  const storedInstances = localStorage.getItem('contracts');
  return storedInstances ? (JSON.parse(storedInstances) as ContractPromise[]) : [];
};

export const getInstanceFromStorage = (
  addr: string,
  api: ApiPromise | null
): ContractPromise | null => {
  let contract: ContractPromise | null = null;
  const stored = getInstancesFromStorage().find(({ address }) => addr === address.toString());
  try {
    if (stored && api) {
      contract = new ContractPromise(api, stored.abi.json, stored.address);
    }
  } catch (error) {
    throw new Error('Error creating contract promise');
  }
  return contract;
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

export function createConstructorOptions(data: AbiConstructor[]): DropdownOption<number>[] {
  return data.map((constructor, index) => ({
    name: <MessageSignature message={constructor} />,
    value: index,
  }));
}

export function createMessageOptions(data?: AbiMessage[]): DropdownOption<AbiMessage>[] {
  return (data || []).map(message => ({
    name: <MessageSignature message={message} />,
    value: message,
  }));
}

export function createAccountOptions(data: Partial<KeyringPair>[]): DropdownOption<string>[] {
  return data.map(pair => ({
    value: pair.address || '',
    name: pair.meta?.name as string,
  }));
}

// convert ArrayBuffer to Uint8Array
export function convertToUint8Array(result: ArrayBuffer): Uint8Array {
  const data = new Uint8Array(result);
  if (data[0] === '0'.charCodeAt(0) && data[1] === 'x'.charCodeAt(0)) {
    let hex = u8aToString(data);

    while (hex[hex.length - 1] === '\n') {
      hex = hex.substr(0, hex.length - 1);
    }

    if (isHex(hex)) {
      return hexToU8a(hex);
    }
  }

  return data;
}

export const NOOP = (): void => undefined;

export function fromBalance(value: BN | null): string {
  if (!value) {
    return '';
  }

  return value.toString();
}

export function toBalance(api: ApiPromise, value: string | number): BN {
  const asString = isNumber(value) ? value.toString() : value;
  const siPower = new BN(api.registry.chainDecimals[0]);

  const isDecimalValue = /^(\d+)\.(\d+)$/.exec(asString);

  if (isDecimalValue) {
    const div = new BN(asString.replace(/\.\d*$/, ''));
    const modString = asString.replace(/^\d+\./, '').substr(0, api.registry.chainDecimals[0]);
    const mod = new BN(modString);

    return div
      .mul(BN_TEN.pow(siPower))
      .add(mod.mul(BN_TEN.pow(new BN(siPower.subn(modString.length)))));
  } else {
    return new BN(asString.replace(/[^\d]/g, '')).mul(BN_TEN.pow(siPower));
  }
}

export function toSats(api: ApiPromise, balance: BN): BN {
  return balance.mul(BN_TEN.pow(new BN(api.registry.chainDecimals)));
}

export function fromSats(api: ApiPromise, sats: BN): BN {
  return sats.div(BN_TEN.pow(new BN(api.registry.chainDecimals)));
}

export function unitOptions() {
  return [
    { name: 'Unit', value: '-' },
    { name: 'Kilo', value: 'k' },
    { name: 'Mill', value: 'M' },
    { name: 'Bill', value: 'B' },
    { name: 'Tril', value: 'T' },
    { name: 'Peta', value: 'P' },
    { name: 'Exa', value: 'E' },
    { name: 'Zeta', value: 'Z' },
    { name: 'Yotta', value: 'Y' },
  ];
}
export function formatData(registry: Registry, data: Raw, { type }: TypeDef): Codec {
  return createTypeUnsafe(registry, type, [data], { isPedantic: true });
}

export function isNumeric(type: string) {
  const numTypes = [
    'Compact<Balance>',
    'BalanceOf',
    'u8',
    'u16',
    'u32',
    'u64',
    'u128',
    'i8',
    'i16',
    'i32',
    'i64',
    'i128',
  ];
  return numTypes.find(t => type.includes(t)) ? true : false;
}

export function convertToNumber(value: string) {
  return value.includes('.') ? parseFloat(value) : parseInt(value);
}

export function transformUserInput(
  api: ApiPromise,
  messageArgs: AbiParam[],
  values?: Record<string, unknown>
) {
  return messageArgs.map(({ name, type: { type } }) => {
    const value = values ? values[name] : null;

    if (type === 'Balance') {
      return api.registry.createType('Balance', value);
    }

    return value || null;
  });

  // return messageArgs.map(({ type: { type } }, index) => {
  //   const value = userInput[index];

  //   if (type === 'bool') {
  //     return value === 'true';
  //   }

  //   if (type.startsWith('Vec')) {
  //     return value.split(',').map(subStr => {
  //       const v = subStr.trim();
  //       if (isNumeric(type)) {
  //         return convertToNumber(v);
  //       }
  //       return v;
  //     });
  //   }
  //   if (isNumeric(type)) {
  //     return convertToNumber(value);
  //   }
  //   return value;
  // });
}
