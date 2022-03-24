// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LookUpCodeHash, AvailableCodeBundles } from 'ui/components/instantiate';
import { Page } from 'ui/templates';

export function SelectCodeHash() {
  const { t } = useTranslation();
  return (
    <Page
      header="Instantiate Contract from Code Hash"
      help={
        <>
          {t('uploadContract', 'You can upload and instantate new contract code')}{' '}
          <Link to="/instantiate" className="text-blue-500">
            {t('here', 'here')}
          </Link>
          .
        </>
      }
    >
      <LookUpCodeHash />
      <AvailableCodeBundles />
    </Page>
  );
}
