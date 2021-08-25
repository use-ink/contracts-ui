import React from 'react';
import { useParams } from 'react-router-dom';
import { Interact } from '../contract/Interact';
import { getInstanceFromStorage, call } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { Page } from 'ui/templates';

type UrlParams = { addr: string };

export const Contract = () => {
  const { api, keyring } = useCanvas();
  const { addr } = useParams<UrlParams>();
  const contract = getInstanceFromStorage(addr.toString(), api);
  const keyringPairs = keyring?.getPairs() || null;

  return (
    <Page
      header={contract?.abi.project.contract.name}
    >
      <Interact
        address={addr}
        metadata={contract?.abi.json}
        keyringPairs={keyringPairs}
        callFn={call}
      />
    </Page>
  );
};
