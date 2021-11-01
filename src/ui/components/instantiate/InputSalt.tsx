// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Switch } from '../Switch';
import { Input } from '../Input';
import { SimpleSpread, UseFormField } from 'types';

type Props = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  UseFormField<string> & {
    isActive?: boolean;
    toggleIsActive: () => void;
  }
>;

export function InputSalt({ isError, onChange, value, isActive = false, toggleIsActive }: Props) {
  return (
    <div className="flex items-center">
      <Input
        className="flex-1"
        id="salt"
        isDisabled={!isActive}
        isError={isError}
        value={isActive ? value : ''}
        onChange={onChange}
        placeholder={isActive ? '0x' : 'Do not use'}
      />
      <div className="flex justify-center items-center w-18">
        <Switch value={isActive} onChange={toggleIsActive} />
      </div>
    </div>
  );
}
