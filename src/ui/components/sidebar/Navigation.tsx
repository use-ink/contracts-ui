import React from 'react';
import { DocumentAddIcon, CollectionIcon } from '@heroicons/react/outline';
import type { Location } from 'history';
import { NavLink } from './NavLink';
import { publicUrl } from 'ui/util';

function isAddNewContractActive(_: unknown, location: Location): boolean {
  return /^\/(add-contract|instantiate-with-hash|instantiate-with-code)/.test(location.pathname);
}

export function Navigation() {
  return (
    <div className="navigation">
      <NavLink
        to={`${publicUrl}/add-contract`}
        icon={DocumentAddIcon}
        isActive={isAddNewContractActive}
      >
        Add New Contract
      </NavLink>
      <NavLink icon={CollectionIcon} to={`${publicUrl}/`} exact>
        All Contracts
      </NavLink>
    </div>
  );
}
