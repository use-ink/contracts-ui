// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormField } from './FormField';
import { Input } from './Input';
import { ValidFormField } from 'types';

export const ContractNameField = ({
  value,
  onChange,
  ...nameValidation
}: ValidFormField<string>) => {
  const { t } = useTranslation();

  return (
    <FormField id="name" label={t('contractName', 'Contract Name')} {...nameValidation}>
      <Input
        id="contractName"
        placeholder={t('contractNamePlaceholder', 'Give your contract a descriptive name')}
        value={value}
        onChange={onChange}
      />
    </FormField>
  );
};
