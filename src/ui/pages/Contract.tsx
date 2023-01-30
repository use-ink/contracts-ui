// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { useLiveQuery } from 'dexie-react-hooks';
import { ContractHeader } from './ContractHeader';
import { InteractTab } from 'ui/components/contract/Interact';
import { MetadataTab } from 'ui/components/contract/Metadata';
import { Loader } from 'ui/components/common/Loader';
import { Tabs } from 'ui/components/common/Tabs';
import { HeaderButtons } from 'ui/components/common/HeaderButtons';
import { PageFull } from 'ui/templates';
import { useApi, useDatabase } from 'ui/contexts';
import { ContractDocument, ContractPromise } from 'types';

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
  const { db } = useDatabase();
  const { address, activeTab = 'interact' } = useParams();
  const [contract, setContract] = useState<ContractPromise>();
  const [document, setDocument] = useState<ContractDocument>();
  const [tabIndex, setTabIndex] = useState(TABS.findIndex(({ id }) => id === activeTab) || 1);

  if (!address) throw new Error('No address in url');

  useLiveQuery(async () => {
    if (!address) return;
    setContract(undefined);
    setDocument(undefined);
    const d = await db.contracts.get({ address });
    if (!d) {
      navigate('/');
    } else {
      const c = new ContractPromise(api, d.abi, address);
      setDocument(d);
      setContract(c);
    }
  }, [address]);

  const projectName = contract?.abi.info.contract.name.toString();

  return (
    <Loader isLoading={!document} message="Loading contract...">
      {document && contract && (
        <PageFull
          accessory={<HeaderButtons contract={document} />}
          header={document?.name || projectName}
          help={
            <ContractHeader
              type={document.external ? 'added' : 'instantiated'}
              document={document}
              name={projectName ?? ''}
            />
          }
        >
          <Tabs index={tabIndex} setIndex={setTabIndex} tabs={TABS}>
            <MetadataTab abi={contract.abi} id={document.id} />
            <InteractTab contract={contract} />
          </Tabs>
        </PageFull>
      )}
    </Loader>
  );
}
