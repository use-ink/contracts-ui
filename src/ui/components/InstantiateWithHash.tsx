import React from 'react';
import { Page } from '../templates';
import { InstantiateWizard } from './Instantiate';

export function InstantiateWithHash () {
  return (
    <Page
      header="Upload and Instantiate Contract"
      help="You can instantiate a new contract from an existing code bundle here."
    >
      <InstantiateWizard />
    </Page>
  );
};
