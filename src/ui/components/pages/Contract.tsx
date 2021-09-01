import React from 'react';
import { useParams } from 'react-router-dom';
import { Interact } from '../contract/Interact';
import { getInstanceFromStorage, call } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { Page } from 'ui/templates';

type UrlParams = { addr: string };

export const Contract = () => {
  const { api } = useCanvas();
  const { addr } = useParams<UrlParams>();
  const contract = getInstanceFromStorage(addr, api);

  return (
    <Page header={contract?.abi.project.contract.name}>
      <Interact contractAddress={addr} metadata={contract?.abi.json} callFn={call} />
    </Page>
  );
};
