// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import type { Reducer } from 'react';
import { INIT_STATE } from '../constants';

import type { CanvasAction, CanvasState } from '../types';

export const canvasReducer: Reducer<CanvasState, CanvasAction> = (state, action) => {
  switch (action.type) {
    case 'SET_ENDPOINT':
      return { ...INIT_STATE, endpoint: action.payload };

    case 'CONNECT_INIT':
      return { ...state, status: 'CONNECT_INIT' };

    case 'CONNECT':
      return { ...state, api: action.payload, status: 'CONNECTING' };

    case 'CONNECT_SUCCESS':
      return { ...state, status: 'SUCCESS' };

    case 'CONNECT_READY':
      return { ...state, blockOneHash: action.payload, status: 'READY' };

    case 'CONNECT_ERROR':
      return { ...state, status: 'ERROR', error: action.payload };

    case 'LOAD_KEYRING':
      return { ...state, keyringStatus: 'LOADING' };

    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringStatus: 'READY' };

    case 'KEYRING_ERROR':
      return { ...state, keyring: null, keyringStatus: 'ERROR' };

    default:
      throw new Error(`Unknown action type`);
  }
};
