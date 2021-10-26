import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import moment from 'moment';
import { InteractTab } from '../contract/Interact';
import { MetadataTab } from '../contract/Metadata';
import { Loader } from '../Loader';
import { Tabs } from '../Tabs';
import { HeaderButtons } from '../HeaderButtons';
import type { UrlParams } from 'types';
import { PageFull } from 'ui/templates';
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
  const { address, activeTab = 'interact' } = useParams<UrlParams>();

  const { data, isLoading, isValid } = useContract(address);

  const [tabIndex, setTabIndex] = useState(TABS.findIndex(({ id }) => id === activeTab) || 1);

  useEffect(
    (): void => {
      if (!isLoading && (!isValid || !data || !data[0])) {
        history.replace('/');
      }
    },
    [data, isLoading, isValid]
  );

  if (!data || !data[0] || !data[1]) {
    return null;
  }

  const [contract, document] = data;
  const projectName = contract?.abi.info.contract.name;

  return (
    <Loader isLoading={!contract && isLoading}>
      <PageFull
        accessory={
          <HeaderButtons contract={document} />
        }
        header={document.name || projectName}
        help={
          <>
            You instantiated this contract from{' '}
            <Link
              to={`/instantiate/hash/${document.codeHash}`}
              className="inline-block relative dark:bg-blue-500 dark:text-blue-400 dark:bg-opacity-20 text-xs px-1.5 font-mono rounded"
            >
              {projectName}
            </Link>
            {' '}on{' '}
            {moment(document.date).format('D MMM')}
          </>
        }
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
