import React from 'react';
import { Wizard } from '../instantiate';
import { Page } from 'ui/templates';

export function InstantiateWithHash() {
  return (
    <Page
      header="Upload and Instantiate Contract"
      help="You can instantiate a new contract from an existing code bundle here."
    >
      <Wizard />
    </Page>
  );
}
