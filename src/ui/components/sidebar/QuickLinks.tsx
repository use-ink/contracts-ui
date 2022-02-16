// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { NavLink } from './NavLink';
import { useDatabase } from 'ui/contexts';

export function QuickLinks() {
  const { myContracts } = useDatabase();

  return (
    <div className="quick-links">
      <div className="section your-contracts">
        <div className="header">Your Contracts</div>
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
            None yet&nbsp;
            {' • '}&nbsp;
            <Link to={`/instantiate`}>Upload one</Link>
          </div>
        )}
      </div>
    </div>
  );
}
