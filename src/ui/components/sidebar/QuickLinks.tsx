// Copyright 2021 @paritytech/canvas-ui authors & contributors

import React from 'react';
import { DocumentIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { NavLink } from './NavLink';
import { useMyContracts } from 'ui/hooks';
import type { ContractDocument } from 'types';

export function QuickLinks() {
  const { data: myContracts } = useMyContracts();

  return (
    <div className="quick-links">
      <div className="section your-contracts">
        <div className="header">Your Contracts</div>
        {myContracts?.owned && myContracts?.owned.length > 0 ? (
          myContracts?.owned?.map(({ name, address }) => {
            return (
              <NavLink icon={DocumentIcon} key={address} to={`/contract/${address}`}>
                {name}
              </NavLink>
            );
          })
        ) : (
          <div className="none-yet">
            None yet
            {' • '}
            <Link to={`/add-contract`}>Upload one</Link>
          </div>
        )}
      </div>
      <div className="section liked-contracts">
        <div className="header">Favorite Contracts</div>
        {myContracts?.starred && myContracts?.starred.length > 0 ? (
          myContracts.starred.map(({ isExistent, value }) => {
            if (!value || !isExistent) {
              return null;
            }

            const { name, address } = value as ContractDocument;

            return (
              <NavLink icon={DocumentIcon} key={address} to={`/contract/${address}`}>
                {name}
              </NavLink>
            );
          })
        ) : (
          <div className="none-yet">None yet</div>
        )}
      </div>
    </div>
  );
}
