// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccountSelect } from '../../account/Select';
import { FormField } from '../FormField';
import { useAccountId } from 'ui/hooks/useAccountId';

export const useAccountSelect = () => {
  const { t } = useTranslation();
  const { value: accountId, onChange: setAccountId, ...accountIdValidation } = useAccountId();

  const AccountSelectField = () => (
    <FormField
      className="mb-8"
      id="accountId"
      label={t('account', 'Account')}
      {...accountIdValidation}
    >
      <AccountSelect id="accountId" className="mb-2" value={accountId} onChange={setAccountId} />
    </FormField>
  );
  return { accountId, AccountSelectField };
};
