import React from 'react';

import { AddContract, Homepage, InstantiateWithCode, InstantiateWithHash } from 'ui/components';

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