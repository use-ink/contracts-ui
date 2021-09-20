import React from 'react';
import { LookUpCodeHash } from 'ui/components/instantiate'
import { Page } from 'ui/templates';

export function SelectCodeHash () {
  return (
    <Page header="Instantiate Contract from Code Hash">
      <LookUpCodeHash />
      {'Or choose from a code hash below'}
      {/* <UploadedContractCode />
      <PopularContractCode /> */}
    </Page>
  );
};
