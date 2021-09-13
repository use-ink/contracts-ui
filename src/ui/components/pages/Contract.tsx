import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { InteractTab } from '../contract/Interact';
import { MetadataTab } from '../contract/Metadata';
import { getInstanceFromStorage, call } from 'canvas';
import { UrlParams } from 'types';
import { useCanvas } from 'ui/contexts';
import { PageFull } from 'ui/templates';
import { classes } from 'ui/util';

export const Contract = () => {
  const { api } = useCanvas();
  const { addr, activeTab } = useParams<UrlParams>();
  const contract = getInstanceFromStorage(addr, api);
  const [active, setActive] = useState(activeTab || 'interact');

  return (
    <PageFull
      header={`${contract?.abi.project.contract.name} Contract`}
      help={`X instantiated this contract from CodeBundle on 31 Dec`}
    >
      <>
        <div className="grid grid-cols-12 w-full">
          <ul className="routed-tabs col-span-8 md:col-span-7">
            <li className="mr-4 ">
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
        <MetadataTab isActive={active === 'metadata'} />
        <InteractTab
          contractAddress={addr}
          metadata={contract?.abi.json}
          callFn={call}
          isActive={active === 'interact'}
        />
      </>
    </PageFull>
  );
};
