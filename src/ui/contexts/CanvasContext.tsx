// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React, { useReducer, useEffect, useContext } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { keyring } from '@polkadot/ui-keyring';

import type { Reducer } from 'react';
import type { CanvasAction, CanvasState } from '../types';

let loadedAccounts = false;

const LOCAL_NODE = 'ws://127.0.0.1:9944';

const INIT_STATE: CanvasState = {
  blockOneHash: null,
  endpoint: LOCAL_NODE,
  keyring: null,
  keyringStatus: null,
  api: null,
  error: null,
  status: null,
};

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


export const CanvasContext = React.createContext(INIT_STATE);

export const CanvasContextProvider = ({
  children,
}: React.PropsWithChildren<Partial<CanvasState>>) => {
  const [state, dispatch] = useReducer(canvasReducer, INIT_STATE);

  const { endpoint, keyringStatus, status } = state;

  useEffect((): void => {
    // We only want this function to be performed once
    if (status) return;

    dispatch({ type: 'CONNECT_INIT' });

    const provider = new WsProvider(endpoint);
    const _api = new ApiPromise({ provider });

    // Set listeners for disconnection and reconnection event.
    _api.on('connected', async () => {
      dispatch({ type: 'CONNECT', payload: _api });
      // `ready` event is not emitted upon reconnection and is checked explicitly here.
      await _api.isReady;

      dispatch({ type: 'CONNECT_SUCCESS' });
    });
    _api.on('ready', async () => {
      const blockOneHash = await _api.query.system.blockHash(1);

      dispatch({ type: 'CONNECT_READY', payload: blockOneHash.toString() });
    });
    _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', payload: err }));
  }, [endpoint, status]);

  useEffect((): void => {
    if (keyringStatus) return;

    if (loadedAccounts) {
      return dispatch({ type: 'SET_KEYRING', payload: keyring });
    }

    async function loadAccounts() {
      dispatch({ type: 'LOAD_KEYRING' });
      try {
        if (typeof window !== 'undefined') {
          await web3Enable('canvas-testing');
          let allAccounts = await web3Accounts();
          allAccounts = allAccounts.map(({ address, meta }) => ({
            address,
            meta: { ...meta, name: `${meta.name} (${meta.source})` },
          }));
          keyring.loadAll({ isDevelopment: true }, allAccounts);
          dispatch({ type: 'SET_KEYRING', payload: keyring });
        }
      } catch (e) {
        console.error(e);
        dispatch({ type: 'KEYRING_ERROR' });
      }
    }

    loadedAccounts = true;
    loadAccounts().catch(console.log);
  }, [keyringStatus]);

  return <CanvasContext.Provider value={state}>{children}</CanvasContext.Provider>;
};

export const useCanvas = () => useContext(CanvasContext);