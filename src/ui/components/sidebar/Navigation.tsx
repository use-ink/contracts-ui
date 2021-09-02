import React from 'react';
import { DocumentAddIcon, CollectionIcon } from '@heroicons/react/outline';
import type { Location } from 'history';
import { NavLink } from './NavLink';

function isAddNewContractActive (_, location: Location): boolean {
  return /^\/(add-contract|instantiate-with-hash|instantiate-with-code)/.test(location.pathname);
}

export function Navigation () {

  return (
    <div className='navigation'>
      <NavLink
        to="/add-contract"
        icon={DocumentAddIcon}
        isActive={isAddNewContractActive}
      >
        Add New Contract
      </NavLink>
      <NavLink
        icon={CollectionIcon}
        to="/"
        exact
      >
        All Contracts
      </NavLink>
    </div>
  );
};
