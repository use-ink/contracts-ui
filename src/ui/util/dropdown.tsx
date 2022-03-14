import React from 'react';
import { MessageSignature } from '../components/message/MessageSignature';
import { AbiConstructor, AbiMessage, DropdownOption, ContractDocument, KeyringPair } from 'types';

export function createConstructorOptions(data?: AbiConstructor[]): DropdownOption<number>[] {
  return (data || []).map((constructor, index) => ({
    label: <MessageSignature message={constructor} />,
    value: index,
  }));
}

export function createMessageOptions(data?: AbiMessage[]): DropdownOption<AbiMessage>[] {
  return (data || []).map(message => ({
    label: <MessageSignature message={message} />,
    value: message,
  }));
}

export function createAccountOptions(data: Partial<KeyringPair>[]): DropdownOption<string>[] {
  return data.map(pair => ({
    label: pair.meta?.name as string,
    value: pair.address || '',
  }));
}

export function createContractOptions(data: ContractDocument[]): DropdownOption<string>[] {
  return data.map(({ name, address }) => ({
    label: name,
    value: address,
  }));
}
