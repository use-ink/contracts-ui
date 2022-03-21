// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { InteractTab } from '../components/contract/Interact';
import { MetadataTab } from '../components/contract/Metadata';
import { Loader } from '../components/common/Loader';
import { Tabs } from '../components/common/Tabs';
import { HeaderButtons } from '../components/common/HeaderButtons';
import { PageFull } from 'ui/templates';
import { useContract } from 'ui/hooks';
import { displayDate, truncate } from 'ui/util';
import { CopyButton } from 'ui/components/common/CopyButton';

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
  const navigate = useNavigate();

  const { address, activeTab = 'interact' } = useParams();

  if (!address) throw new Error('No address in url');

  const { data, isLoading, isValid } = useContract(address);

  const [tabIndex, setTabIndex] = useState(TABS.findIndex(({ id }) => id === activeTab) || 1);

  useEffect((): void => {
    if (!isLoading && (!isValid || !data || !data[0])) {
      navigate('/');
    }
  }, [data, isLoading, isValid, navigate]);

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
          <div>
            You instantiated this contract{' '}
            <div className="inline-flex items-center">
              <span className="inline-block relative bg-blue-500 text-blue-400 bg-opacity-20 text-xs px-1.5 font-mono rounded">
                {truncate(address)}
              </span>
              <CopyButton className="ml-1" iconClassName="-mt-1.5" value={address} />
            </div>{' '}
            from{' '}
            <Link
              to={`/instantiate/${document.codeHash}`}
              className="inline-block relative bg-blue-500 text-blue-400 bg-opacity-20 text-xs px-1.5 font-mono rounded"
            >
              {projectName}
            </Link>{' '}
            on {displayDate(document.date)}
          </div>
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
