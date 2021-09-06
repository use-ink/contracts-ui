import React from 'react';
import {
  AddContract,
  Homepage,
  Contract,
  InstantiateWithCode,
  InstantiateWithHash,
} from '../pages';

import { publicUrl } from '../../util';

export const routes = [
  {
    path: `${publicUrl}/contract/:addr`,
    component: Contract,
    exact: true,
    fallback: <div> Loading... </div>,
  },
  {
    path: `${publicUrl}/add-contract`,
    component: AddContract,
    exact: false,
    fallback: <div> Loading... </div>,
  },
  {
    path: `${publicUrl}/instantiate-with-hash`,
    component: InstantiateWithHash,
    exact: false,
    fallback: <div> Loading... </div>,
  },
  {
    path: `${publicUrl}/instantiate-with-code`,
    component: InstantiateWithCode,
    exact: false,
    fallback: <div> Loading... </div>,
  },
  {
    path: `${publicUrl}/`,
    component: Homepage,
    exact: true,
    fallback: <div> Loading... </div>,
  },
];
