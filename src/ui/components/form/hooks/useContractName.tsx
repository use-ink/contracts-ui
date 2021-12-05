// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { useNonEmptyString } from 'ui/hooks/useNonEmptyString';

export const useContractName = () => {
  const { value: name, onChange: setName, ...nameValidation } = useNonEmptyString();

  const contractNameField = (
    <FormField id="name" label="Contract Name" {...nameValidation}>
      <Input
        id="contractName"
        placeholder="Give your contract a descriptive name"
        value={name}
        onChange={setName}
      />
    </FormField>
  );

  return { name, setName, contractNameField, nameValidation };
};
