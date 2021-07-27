import React from 'react';
import { Contracts } from './Contracts';
import { HelpBox } from './HelpBox';
import { PageHome } from 'ui/templates';

export function Homepage () {
  return (
    <PageHome
      header="Contracts"
    >
      <Contracts />
      <HelpBox />
    </PageHome>
  );
};