// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { decodeAddress } from '@polkadot/keyring';
import { InkVersion } from 'ui/contexts';
import { MessageSignature } from '../components/message/MessageSignature';
import {
  AbiConstructor,
  AbiMessage,
  DropdownOption,
  ContractDocument,
  Registry,
  Account,
} from 'types';
import { toEthAddress } from 'lib/address';

export function createConstructorOptions(
  registry: Registry,
  data?: AbiConstructor[],
): DropdownOption<number>[] {
  return (data || []).map((constructor, index) => ({
    label: <MessageSignature message={constructor} registry={registry} />,
    value: index,
  }));
}

export function createMessageOptions(
  registry: Registry,
  data?: AbiMessage[],
): DropdownOption<AbiMessage>[] {
  return (data || []).map(message => ({
    label: <MessageSignature message={message} registry={registry} />,
    value: message,
  }));
}

export function createAccountOptions(
  data: Account[],
  version?: InkVersion,
): DropdownOption<string>[] {
  return data.map(pair => {
    const address = version === 'v6' ? toEthAddress(decodeAddress(pair.address)) : pair.address;

    return {
      label: pair.meta?.name as string,
      value: address || '',
    };
  });
}

export function createContractOptions(data: ContractDocument[]): DropdownOption<string>[] {
  return data.map(({ name, address }) => ({
    label: name,
    value: address,
  }));
}
