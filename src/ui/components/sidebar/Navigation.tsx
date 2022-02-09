// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { DocumentAddIcon, CollectionIcon } from '@heroicons/react/outline';
import { NavLink } from './NavLink';

export function Navigation() {
  return (
    <div className="navigation">
      <NavLink to={`/add-contract`} icon={DocumentAddIcon}>
        Add New Contract
      </NavLink>
      <NavLink icon={CollectionIcon} to={`/`} end>
        All Contracts
      </NavLink>
    </div>
  );
}
