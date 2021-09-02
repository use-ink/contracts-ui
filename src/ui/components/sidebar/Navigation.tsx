import React, { useCallback } from 'react';
import { DocumentAddIcon, CollectionIcon } from '@heroicons/react/outline';
import type { Location } from 'history';
import { NavLink } from './NavLink';

export function Navigation () {
  const isAddNewContract = useCallback(
    (_, location: Location) => {
      return /^\/(add-contract|instantiate-with-hash|instantiate-with-code)/.test(location.pathname);
    },
    []
  );

  return (
    <div className='navigation'>
      <NavLink
        to="/add-contract"
        icon={DocumentAddIcon}
        isActive={isAddNewContract}
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
