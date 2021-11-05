// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useReducer, useEffect, useContext } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { keyring } from '@polkadot/ui-keyring';

import type { Reducer } from 'react';
import type { ApiAction, ApiState, ChainProperties } from 'types';

let loadedAccounts = false;

export const LOCAL_NODE = 'ws://127.0.0.1:9944'; //wss://canvas-rpc.parity.io
const DEFAULT_DECIMALS = 12;

const NULL_CHAIN_PROPERTIES = {
  blockZeroHash: null,
  systemName: null,
  systemVersion: null,
  tokenDecimals: DEFAULT_DECIMALS,
  tokenSymbol: 'Unit',
};

const INIT_STATE: ApiState = {
  ...NULL_CHAIN_PROPERTIES,
  endpoint: LOCAL_NODE,
  keyringStatus: null,
  error: null,
  status: 'CONNECT_INIT',
} as unknown as ApiState;

async function getChainProperties(api: ApiPromise): Promise<ChainProperties> {
  const [chainProperties, blockZeroHash, systemName, systemVersion] = await Promise.all([
    api.rpc.system.properties(),
    api.query.system.blockHash(0),
    api.rpc.system.name(),
    api.rpc.system.version(),
  ]);

  return {
    blockZeroHash: blockZeroHash.toString(),
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
    tokenDecimals: chainProperties.tokenDecimals.isSome
      ? chainProperties.tokenDecimals.unwrap().toArray()[0].toNumber()
      : DEFAULT_DECIMALS,
    tokenSymbol: chainProperties.tokenSymbol.isSome
      ? chainProperties.tokenSymbol
          .unwrap()
          .toArray()
          .map(s => s.toString())[0]
      : 'Unit',
  };
}

export const apiReducer: Reducer<ApiState, ApiAction> = (state, action) => {
  switch (action.type) {
    case 'SET_ENDPOINT':
      return { ...INIT_STATE, status: 'CONNECT_INIT', endpoint: action.payload };

    case 'CONNECT_INIT':
      return { ...state, status: 'CONNECT_INIT' };

    case 'CONNECT':
      return { ...state, api: action.payload, error: null, status: 'CONNECTING' };

    case 'CONNECT_READY':
      return { ...state, ...action.payload, error: null, status: 'READY' };

    case 'CONNECT_ERROR':
      return { ...state, ...NULL_CHAIN_PROPERTIES, status: 'ERROR', error: action.payload };

    case 'LOAD_KEYRING':
      return { ...state, keyringStatus: 'LOADING' };

    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringStatus: 'READY' };

    case 'KEYRING_ERROR':
      return { ...state, keyringStatus: 'ERROR' };

    default:
      throw new Error(`Unknown action type`);
  }
};

export const ApiContext = React.createContext(INIT_STATE);

export const ApiContextProvider = ({ children }: React.PropsWithChildren<Partial<ApiState>>) => {
  const [state, dispatch] = useReducer(apiReducer, INIT_STATE);

  const { endpoint, keyringStatus } = state;

  useEffect((): void => {
    dispatch({ type: 'CONNECT_INIT' });

    const provider = new WsProvider(endpoint);
    const _api = new ApiPromise({ provider });

    // Set listeners for disconnection and reconnection event.
    _api.on('connected', async () => {
      dispatch({ type: 'CONNECT', payload: _api });
      // `ready` event is not emitted upon reconnection and is checked explicitly here.
      await _api.isReady;

      dispatch({
        type: 'CONNECT_READY',
        payload: await getChainProperties(_api),
      });
    });

    _api.on('ready', async () => {
      dispatch({
        type: 'CONNECT_READY',
        payload: await getChainProperties(_api),
      });
    });

    _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', payload: err }));
  }, [endpoint]);

  useEffect((): void => {
    if (keyringStatus) return;

    if (loadedAccounts) {
      return dispatch({ type: 'SET_KEYRING', payload: keyring });
    }

    async function loadAccounts() {
      dispatch({ type: 'LOAD_KEYRING' });
      try {
        if (typeof window !== 'undefined') {
          await web3Enable('substrate-contracts-explorer');
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
    loadAccounts().catch(console.error);
  }, [keyringStatus]);

  return <ApiContext.Provider value={state}>{children}</ApiContext.Provider>;
};

export const useApi = () => useContext(ApiContext);
