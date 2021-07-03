import React from 'react';
import RouteInterface from './RouteInterface';

import Homepage from '@ui/components/Homepage';
import AddContract from '@ui/components/AddContract';
import InstantiateWithHash from '@ui/components/InstantiateWithHash';

const routes: RouteInterface[] = [
  {
    path: '/',
    component: Homepage,
    exact: true,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/add-contract',
    component: AddContract,
    exact: false,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/instantiate-with-hash',
    component: InstantiateWithHash,
    exact: false,
    fallback: <div> Loading... </div>,
  },
];

export default routes;
