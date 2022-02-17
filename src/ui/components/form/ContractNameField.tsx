// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormField } from './FormField';
import { Input } from './Input';
import { ValidFormField } from 'types';

export const ContractNameField = ({
  value,
  onChange,
  ...nameValidation
}: ValidFormField<string>) => {
  return (
    <FormField id="name" label="Contract Name" {...nameValidation}>
      <Input
        id="contractName"
        placeholder="Give your contract a descriptive name"
        value={value}
        onChange={onChange}
      />
    </FormField>
  );
};
