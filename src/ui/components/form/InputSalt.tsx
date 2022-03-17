// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '../common/Switch';
import { Input } from './Input';
import { SimpleSpread, ValidFormField } from 'types';

type Props = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  ValidFormField<string> & {
    isActive?: boolean;
    toggleIsActive: () => void;
  }
>;

export function InputSalt({ isError, onChange, value, isActive = false, toggleIsActive }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center">
      <Input
        className="flex-1"
        id="salt"
        isDisabled={!isActive}
        isError={isError}
        value={isActive ? value : ''}
        onChange={onChange}
        placeholder={isActive ? '0x' : t('doNotUse', 'Do not use')}
      />
      <div className="flex justify-center items-center w-18">
        <Switch value={isActive} onChange={toggleIsActive} />
      </div>
    </div>
  );
}
