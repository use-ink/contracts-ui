import React from 'react';
import { Contracts, HelpBox, Statistics } from '../homepage';
import { PageHome } from 'ui/templates';

export function Homepage () {
  return (
    <PageHome
      header="Contracts"
    >
      <Contracts />
      <HelpBox />
      <Statistics />
    </PageHome>
  );
}; 
