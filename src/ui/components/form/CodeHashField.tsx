// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CodeHash } from '../instantiate/CodeHash';
import { FormField } from './FormField';

interface Props {
  codeHash: string;
  name: string;
}

export const CodeHashField = ({ codeHash, name }: Props) => {
  const { t } = useTranslation();

  return (
    <FormField id="metadata" label={t('onChainCode', 'On-Chain Code')}>
      <CodeHash codeHash={codeHash} name={name} />
    </FormField>
  );
}
