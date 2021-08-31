// Copyright 2021 @paritytech/canvas-ui authors & contributors

import React, { useCallback } from 'react';
import { DocumentAddIcon, ChatAltIcon, CollectionIcon, CogIcon, DocumentIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import type { Location } from 'history';
import { Button } from '../Button';
import { SelectChain } from './SelectChain';
import { NavLink } from './NavLink';
import { useDatabase } from 'ui/contexts';
import { useMyContracts } from 'ui/hooks';
import type { ContractDocument } from 'types';

export function Sidebar () {
  const { user } = useDatabase();
  const { data: myContracts } = useMyContracts();

  const isAddNewContract = useCallback(
    (_, location: Location) => {
      return /^\/(add-contract|instantiate-with-hash|instantiate-with-code)/.test(location.pathname);
    },
    []
  );

  return (
    <>
      <div className="sidebar">
          <div>
            <div>
              <nav aria-label="Sidebar">
                <div className='network-selection'>
                  <SelectChain />
                  {!user?.creator && (
                    <Button
                      className='connect-account'
                      variant='primary'
                    >
                      Connect Account
                    </Button>
                  )}
                </div>
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
                <div className='section your-contracts'>
                  <div className='header'>Your Contracts</div>
                  {myContracts?.owned && myContracts?.owned.length > 0
                    ? myContracts?.owned?.map(({ name, address }) => {
                      return (
                        <NavLink
                          icon={DocumentIcon}
                          key={address}
                          to={`/contract/${address}`}
                        >
                          {name}
                        </NavLink>
                      )
                    })
                    : (
                      <div className='none-yet'>
                        None yet
                        {' ˑ '}
                        <Link to='/add-contract'>Upload one</Link>
                      </div>
                    )
                  }
                </div>
                <div className='section liked-contracts'>
                  <div className='header'>Favorite Contracts</div>
                  {myContracts?.starred && myContracts?.starred.length > 0
                    ? myContracts.starred.map(({ isExistent, value }) => {
                      if (!value || !isExistent) {
                        return null;
                      }

                      const { name, address }  = value as ContractDocument

                      return (
                        <NavLink
                          icon={DocumentIcon}
                          key={address}
                          to={`/contract/${address}`}
                        >
                          {name}
                        </NavLink>
                      )
                    })
                    : (
                      <div className='none-yet'>
                        None yet
                      </div>
                    )
                  }
                </div>
              </nav>
            </div>
            <footer>
              <div>
                <a
                  href="#"
                  className="flex content-center text-sm font-medium dark:text-gray-500 text-gray-600 dark:hover:text-gray-300 hover:text-gray-500"
                >
                  <ChatAltIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                  Help &amp; Feedback
                </a>
                <a href="#">
                  <CogIcon
                    className="h-5 w-5 dark:text-gray-500 dark:hover:text-gray-300 text-gray-600 hover:text-gray-500"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </footer>
          </div>
        </div>
    </>
  );
};
