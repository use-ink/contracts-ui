// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { DocumentAddIcon, CollectionIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import { NavLink } from './NavLink';

export function Navigation() {
  const { t } = useTranslation();

  return (
    <div className="navigation">
      <NavLink to={`/add-contract`} icon={DocumentAddIcon}>
        {t('addNewContract', 'Add New Contract')}
      </NavLink>
      <NavLink icon={CollectionIcon} to={`/`} end>
        {t('allContracts', 'All Contracts')}
      </NavLink>
    </div>
  );
}
