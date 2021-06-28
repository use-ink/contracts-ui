import React from 'react';
import Homepage from '../components/Homepage';
import AddContract from '../components/AddContract';
import InstantiateWithHash from '../components/InstantiateWithHash';

import { Route } from './Route';

export const routes: Route[] = [
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
