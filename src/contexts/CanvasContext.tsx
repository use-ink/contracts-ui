import React, { useReducer, useContext, Dispatch, Reducer } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { keyring } from '@polkadot/ui-keyring';
import { AppState, Action } from '../types';

///
// Initial state for `useReducer`

const INIT_STATE: AppState = {
  socket: 'ws://127.0.0.1:9944',
  keyring: null,
  keyringState: null,
  api: null,
  apiError: null,
  apiState: null,
};

///
// Reducer function for `useReducer`

const reducer: Reducer<AppState, Action> = (state, action) => {
  switch (action.type) {
    case 'CONNECT_INIT':
      return { ...state, apiState: 'CONNECT_INIT' };

    case 'CONNECT':
      return { ...state, api: action.payload, apiState: 'CONNECTING' };

    case 'CONNECT_SUCCESS':
      return { ...state, apiState: 'READY' };

    case 'CONNECT_ERROR':
      return { ...state, apiState: 'ERROR', apiError: action.payload };

    case 'LOAD_KEYRING':
      return { ...state, keyringState: 'LOADING' };

    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringState: 'READY' };

    case 'KEYRING_ERROR':
      return { ...state, keyring: null, keyringState: 'ERROR' };

    default:
      throw new Error(`Unknown action type`);
  }
};

///
// Connecting to the Substrate node

const connect = (state: AppState, dispatch: Dispatch<Action>) => {
  const { apiState, socket } = state;
  // We only want this function to be performed once
  if (apiState) return;

  dispatch({ type: 'CONNECT_INIT' });

  const provider = new WsProvider(socket);
  const _api = new ApiPromise({ provider });

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch({ type: 'CONNECT', payload: _api });
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then(() => dispatch({ type: 'CONNECT_SUCCESS' })).catch(console.log);
  });
  _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
  _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', payload: err }));
};

///
// Loading accounts from dev and polkadot-js extension

let loadAccts = false;
const loadAccounts = (state: AppState, dispatch: Dispatch<Action>) => {
  const asyncLoadAccounts = async () => {
    dispatch({ type: 'LOAD_KEYRING' });
    try {
      if (window !== undefined) {
        await web3Enable('canvas-ui-v2');
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
  };

  const { keyringState } = state;
  // If `keyringState` is not null `asyncLoadAccounts` is running.
  if (keyringState) return;
  // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
  if (loadAccts) return dispatch({ type: 'SET_KEYRING', payload: keyring });

  // This is the heavy duty work
  loadAccts = true;
  asyncLoadAccounts().catch(console.log);
};

const CanvasContext = React.createContext(INIT_STATE);

const CanvasContextProvider = (props: React.PropsWithChildren<Partial<AppState>>) => {
  const initState = { ...INIT_STATE, ...props };
  const { children } = props;

  const [state, dispatch] = useReducer(reducer, initState);
  connect(state, dispatch);
  loadAccounts(state, dispatch);

  return <CanvasContext.Provider value={state}>{children}</CanvasContext.Provider>;
};

const useCanvas = () => ({ ...useContext(CanvasContext) });

export { CanvasContextProvider, useCanvas, CanvasContext };
