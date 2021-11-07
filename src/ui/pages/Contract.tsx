// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import moment from 'moment';
import { InteractTab } from '../components/contract/Interact';
import { MetadataTab } from '../components/contract/Metadata';
import { Loader } from '../components/common/Loader';
import { Tabs } from '../components/common/Tabs';
import { HeaderButtons } from '../components/common/HeaderButtons';
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
    ),
  },
  {
    id: 'interact',
    label: (
      <>
        <PlayIcon />
        Interact
      </>
    ),
  },
];

export function Contract() {
  const history = useHistory();
  const { address, activeTab = 'interact' } = useParams<UrlParams>();

  const { data, isLoading, isValid } = useContract(address);

  const [tabIndex, setTabIndex] = useState(TABS.findIndex(({ id }) => id === activeTab) || 1);

  useEffect((): void => {
    if (!isLoading && (!isValid || !data || !data[0])) {
      history.replace('/');
    }
  }, [data, history, isLoading, isValid]);

  if (!data || !data[0] || !data[1]) {
    return null;
  }

  const [contract, document] = data;
  const projectName = contract?.abi.info.contract.name;

  return (
    <Loader isLoading={!contract && isLoading}>
      <PageFull
        accessory={<HeaderButtons contract={document} />}
        header={document.name || projectName}
        help={
          <>
            You instantiated this contract from{' '}
            <Link
              to={`/instantiate/hash/${document.codeHash}`}
              className="inline-block relative dark:bg-blue-500 dark:text-blue-400 dark:bg-opacity-20 text-xs px-1.5 font-mono rounded"
            >
              {projectName}
            </Link>{' '}
            on {moment(document.date).format('D MMM')}
          </>
        }
      >
        <Tabs index={tabIndex} setIndex={setTabIndex} tabs={TABS}>
          <MetadataTab abi={contract?.abi} />
          <InteractTab contract={contract} />
        </Tabs>
      </PageFull>
    </Loader>
  );
}
