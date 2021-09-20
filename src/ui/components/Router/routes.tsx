import React from 'react';
import {
  Homepage,
  Contract,
  Instantiate,
  AddContract,
} from '../pages';
import { SelectCodeHash } from '../pages/SelectCodeHash';

export const routes = [
  {
    path: `/contract/:addr`,
    component: Contract,
    exact: true,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/instantiate',
    component: AddContract,
    exact: true,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/instantiate/new',
    component: Instantiate,
    exact: true,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/instantiate/codes',
    component: SelectCodeHash,
    exact: true,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/instantiate/:codeHash',
    component: Instantiate,
    exact: false,
    fallback: <div> Loading... </div>,
  },
  {
    path: `/`,
    component: Homepage,
    exact: true,
    fallback: <div> Loading... </div>,
  },
];
