// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavLink } from './NavLink';
import { useDatabase } from 'ui/contexts';

export function QuickLinks() {
  const { t } = useTranslation();
  const { myContracts } = useDatabase();

  return (
    <div className="quick-links">
      <div className="section your-contracts">
        <div className="header">{t('yourContracts', 'Your Contracts')}</div>
        {myContracts?.owned && myContracts?.owned.length > 0 ? (
          myContracts?.owned?.map(({ name, address }) => {
            return (
              <NavLink icon={DocumentTextIcon} key={address} to={`/contract/${address}`}>
                {name}
              </NavLink>
            );
          })
        ) : (
          <div className="none-yet">
            {t('noneYet', 'None yet')}&nbsp;
            {' • '}&nbsp;
            <Link to={`/instantiate`}>{t('uploadOne', 'Upload one')}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
