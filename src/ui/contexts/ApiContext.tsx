// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useReducer, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INIT_STATE, RPC } from '../../constants';
import type { ApiState } from 'types';
import { loadAccounts, connect, isValidWsUrl } from 'api';
import { apiReducer } from 'ui/reducers';
import { useLocalStorage } from 'ui/hooks/useLocalStorage';

export const ApiContext = createContext(INIT_STATE);

let keyringLoadAll = false;

export const ApiContextProvider = ({ children }: React.PropsWithChildren<Partial<ApiState>>) => {
  const [searchParams] = useSearchParams();
  const rpcUrl = searchParams.get('rpc');
  const [preferredEndpoint, setPreferredEndpoint] = useLocalStorage<string>(
    'contractsUiPreferredEndpoint',
    RPC.CONTRACTS
  );
  const [state, dispatch] = useReducer(apiReducer, { ...INIT_STATE, endpoint: preferredEndpoint });
  const { endpoint, keyringStatus, status } = state;

  useEffect(() => {
    if (rpcUrl && isValidWsUrl(rpcUrl) && rpcUrl !== preferredEndpoint) {
      dispatch({ type: 'SET_ENDPOINT', payload: rpcUrl });
      setPreferredEndpoint(rpcUrl);
      window.location.reload();
    }
  }, [preferredEndpoint, rpcUrl, searchParams, setPreferredEndpoint]);

  useEffect((): void => {
    connect(endpoint, dispatch);
  }, [endpoint]);

  useEffect(() => {
    if (status === 'READY' && !keyringStatus && !keyringLoadAll) {
      keyringLoadAll = true;
      loadAccounts(state, dispatch);
    }
  }, [state, dispatch, status, keyringStatus]);

  return <ApiContext.Provider value={state}>{children}</ApiContext.Provider>;
};

export const useApi = () => useContext(ApiContext);
