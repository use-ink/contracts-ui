import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { InteractTab } from '../contract/Interact';
import { MetadataTab } from '../contract/Metadata';
import { call } from 'canvas';
import { UrlParams } from 'types';
import { PageFull } from 'ui/templates';
import { classes } from 'ui/util';
import { useContract } from 'ui/hooks';

export const Contract = () => {
  const { addr, activeTab } = useParams<UrlParams>();

  const { data: contract } = useContract(addr);

  const [active, setActive] = useState(activeTab || 'interact');

  return contract ? (
    <PageFull
      header={`${contract.abi.project.contract.name}`}
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
