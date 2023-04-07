// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { DocumentTextIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import { NavLink } from './NavLink';
import { useDatabase } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';

export function QuickLinks() {
  const { db } = useDatabase();
  const [contracts] = useDbQuery(() => db?.contracts.toArray() || Promise.resolve(null), [db]);

  return (
    <div className="quick-links">
      <div className="section your-contracts">
        <div className="header text-gray-400">WASM Contract Explorers</div>
          <Link className="text-blue-400" to={`https://analytics.polkaholic.io/superset/dashboard/021154ed-efe1-4538-a177-30ae5ef59911/?standalone=1`}>
            Polkaholic.io
          </Link>
        </div>
        <div className="header text-gray-400">Your Contracts</div>
        {contracts && contracts.length > 0 ? (
          contracts.map(({ name, address }) => {
            return (
              <NavLink icon={DocumentTextIcon} key={address} to={`/contract/${address}`}>
                {name}
              </NavLink>
            );
          })
        ) : (
          <div className="none-yet text-gray-400">
            None yet&nbsp;
            {' • '}&nbsp;
            <Link className="text-blue-400" to={`/instantiate`}>
              Upload one
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
