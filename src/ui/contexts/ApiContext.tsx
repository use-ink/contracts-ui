// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useReducer, useEffect, useContext } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { keyring } from '@polkadot/ui-keyring';
import { INIT_STATE, DEFAULT_DECIMALS } from '../../constants';
import type { ApiState, ChainProperties } from 'types';
import { apiReducer } from 'ui/reducers';
import { blockTimeMs } from 'api/util/blockTime';

let loadedAccounts = false;

async function getChainProperties(api: ApiPromise): Promise<ChainProperties | null> {
  const blockNumber = (await api.rpc.chain.getHeader()).number.toNumber();

  if (blockNumber > 1) {
    const [chainProperties, blockOneHash, systemName, systemVersion] = await Promise.all([
      api.rpc.system.properties(),
      api.query.system.blockHash(1),
      api.rpc.system.name(),
      api.rpc.system.version(),
    ]);

    const result = {
      blockOneHash: blockOneHash.toString(),
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

    return result;
  }

  return null;
}

async function getChainPropertiesWhenReady(api: ApiPromise) {
  let chainProperties = await getChainProperties(api);

  if (!chainProperties) {
    chainProperties = await new Promise(resolve => {
      const interval = setInterval(() => {
        getChainProperties(api)
          .then(result => {
            if (result) {
              clearInterval(interval);
              resolve(result);
            }
          })
          .catch(console.error);
      }, blockTimeMs(api).toNumber());
    });
  }

  return chainProperties as ChainProperties;
}

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
        payload: await getChainPropertiesWhenReady(_api),
      });
    });

    _api.on('ready', async () => {
      dispatch({
        type: 'CONNECT_READY',
        payload: await getChainPropertiesWhenReady(_api),
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
