import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { InteractTab } from '../contract/Interact';
import { MetadataTab } from '../contract/Metadata';
import { Loader } from '../Loader';
import { Tabs } from '../Tabs';
import { UrlParams } from 'types';
import { PageFull } from 'ui/templates';
// import { classes } from 'ui/util';
import { useContract } from 'ui/hooks';

const TABS = [
  {
    id: 'metadata',
    label: (
      <>
        <BookOpenIcon />
        Metadata
      </>
    )
  },
  {
    id: 'interact',
    label: (
      <>
        <PlayIcon />
        Interact
      </>
    )
  }
]

export function Contract () {
  const history = useHistory();
  const { addr, activeTab = 'interact' } = useParams<UrlParams>();

  const { data: contract, isLoading } = useContract(addr);

  const [tabIndex, setTabIndex] = useState(TABS.findIndex(({ id }) => id === activeTab) || 1);

  // const [active, setActive] = useState(activeTab || 'interact');

  useEffect(
    (): void => {
      if (!isLoading && !contract) {
        history.replace('/');
      }
    },
    [contract, isLoading]
  );

  if (!contract) {
    return null;
  }

  return (
    <Loader isLoading={!contract && isLoading}>
      <PageFull
        header={`${contract?.abi.project.contract.name}`}
        help={`You instantiated this contract from CodeBundle on 31 Dec`}
      >
        <Tabs
          index={tabIndex}
          setIndex={setTabIndex}
          tabs={TABS}
        >
          <MetadataTab
            abi={contract?.abi}
          />
          <InteractTab
            contract={contract}
          />
        </Tabs>
        {/* {contract && (
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
        </> */}
        
      </PageFull>
    </Loader>
  )
};
