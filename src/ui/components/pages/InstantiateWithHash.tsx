import React from 'react';
import { Wizard } from '../instantiate';
import { Page } from 'ui/templates';

export const InstantiateWithHash = () => {
  return (
    <Page
      header="Upload and Instantiate Contract"
      help="You can instantiate a new contract from an existing code bundle here."
    >
      <Wizard instatiationType="hash" />
    </Page>
  );
};
