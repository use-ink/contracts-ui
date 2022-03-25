// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Contracts, HelpBox, Statistics } from '../components/homepage';
import { PageHome } from 'ui/templates';

export function Homepage() {
  const { t } = useTranslation();

  return (
    <PageHome header={t('homepageTitle', 'Contracts')}>
      <Contracts />
      <HelpBox />
      <Statistics />
    </PageHome>
  );
}
