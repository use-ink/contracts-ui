// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { InteractTab } from '../contract/Interact';
import { MetadataTab } from '../contract/Metadata';
import { getInstanceFromStorage, call } from 'api';
import { UrlParams } from 'types';
import { useApi } from 'ui/contexts';
import { PageFull } from 'ui/templates';
import { classes } from 'ui/util';

export const Contract = () => {
  const { api } = useApi();
  const { addr, activeTab } = useParams<UrlParams>();
  const contract = getInstanceFromStorage(addr, api);
  const [active, setActive] = useState(activeTab || 'interact');

  return contract ? (
    <PageFull
      header={`${contract.abi.info.contract.name}`}
      help={`X instantiated this contract from CodeBundle on 31 Dec`}
    >
      <>
        <div className="grid grid-cols-12 w-full">
          <ul className="routed-tabs col-span-6 lg:col-span-7 2xl:col-span-8">
            <li className="mr-1">
              <button
                onClick={() => setActive('metadata')}
                className={classes('tab', active === 'metadata' ? 'active' : '')}
              >
                <BookOpenIcon />
                Metadata
              </button>
            </li>
            <li>
              <button
                onClick={() => setActive('interact')}
                className={classes('tab', active === 'interact' ? 'active' : '')}
              >
                <PlayIcon />
                Interact
              </button>
            </li>
          </ul>
        </div>
        <MetadataTab isActive={active === 'metadata'} abi={contract.abi} />
        <InteractTab
          contractAddress={addr}
          abi={contract.abi}
          callFn={call}
          isActive={active === 'interact'}
        />
      </>
    </PageFull>
  ) : null;
};
