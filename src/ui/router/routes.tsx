import React from 'react';

import Homepage from '@ui/components/Homepage';
import AddContract from '@ui/components/AddContract';
import InstantiateWithHash from '@ui/components/InstantiateWithHash';
import InstantiateWithCode from '@ui/components/InstantiateWithCode';

const routes = [
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
  {
    path: '/instantiate-with-code',
    component: InstantiateWithCode,
    exact: false,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/',
    component: Homepage,
    exact: true,
    fallback: <div> Loading... </div>,
  },
];

export default routes;
