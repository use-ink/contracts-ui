// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { InteractTab } from '../components/contract/Interact';
import { MetadataTab } from '../components/contract/Metadata';
import { Loader } from '../components/common/Loader';
import { Tabs } from '../components/common/Tabs';
import { HeaderButtons } from '../components/common/HeaderButtons';
import { PageFull } from 'ui/templates';
import { useContract } from 'ui/hooks';
import { displayDate } from 'ui/util';
import { checkOnChainCode } from 'api';
import { useApi } from 'ui/contexts';

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
  const { api } = useApi();

  const { address, activeTab = 'interact' } = useParams();

  if (!address) throw new Error('No address in url');

  //TODO: check if address is valid

  const [contract, document, isLoading] = useContract(address);

  const [tabIndex, setTabIndex] = useState(TABS.findIndex(({ id }) => id === activeTab) || 1);

  const [isOnChain, setIsOnChain] = useState(true);

  useEffect(() => {
    document &&
      checkOnChainCode(api, document.codeHash || '')
        .then(isOnChain => setIsOnChain(isOnChain))
        .catch(console.error);
  }, [api, document]);

  useEffect((): void => {
    if (!isLoading && (!document || !contract)) {
      navigate('/');
    }
  }, [contract, document, isLoading, navigate]);

  if (!document || !contract) {
    return null;
  }

  const projectName = contract?.abi.info.contract.name;

  return (
    <Loader isLoading={!contract && isLoading}>
      <PageFull
        accessory={<HeaderButtons contract={document} />}
        header={document.name || projectName}
        help={
          isOnChain && (
            <>
              You instantiated this contract from{' '}
              <Link
                to={`/instantiate/${document.codeHash}`}
                className="inline-block relative bg-blue-500 text-blue-400 bg-opacity-20 text-xs px-1.5 font-mono rounded"
              >
                {projectName}
              </Link>{' '}
              on {displayDate(document.date)}
            </>
          )
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
