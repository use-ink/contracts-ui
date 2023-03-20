// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import type { ApiState } from 'types';

export const ROCOCO_CONTRACTS = {
  relay: 'Rococo',
  name: 'Contracts (Rococo)',
  rpc: 'wss://rococo-contracts-rpc.polkadot.io',
};

export const LOCAL = {
  relay: undefined,
  name: 'Local Node',
  rpc: 'ws://127.0.0.1:9944',
};

// https://docs.peaq.network/networks-overview
const PEAQ_AGUNG = {
  relay: 'Rococo',
  name: 'Peaq Agung',
  rpc: 'wss://wss.agung.peaq.network',
};

const PHALA_TESTNET = {
  relay: undefined,
  name: 'Phala PoC-5',
  rpc: 'wss://poc5.phala.network/ws',
};

// https://docs.astar.network/docs/build/environment/endpoints
const ASTAR_SHIDEN = {
  relay: 'Kusama',
  name: 'Astar Shiden',
  rpc: 'wss://rpc.shiden.astar.network',
};

// https://docs.astar.network/docs/build/environment/endpoints
const ASTAR_SHIBUYA = {
  relay: 'Tokyo',
  name: 'Astar Shibuya',
  rpc: 'wss://rpc.shibuya.astar.network',
};

const ALEPH_ZERO_TESTNET = {
  relay: undefined,
  name: 'Aleph Zero Testnet',
  rpc: 'wss://ws.test.azero.dev',
};

// https://docs.t3rn.io/collator/testnet/testnet-collator
const T3RN_T0RN = {
  relay: undefined,
  name: 'T3RN T0RN',
  rpc: 'wss://ws.t0rn.io',
};

// https://pendulum.gitbook.io/pendulum-docs/build/build-environment/foucoco-testnet
const PENDULUM_TESTNET = {
  relay: 'Rococo',
  name: 'Pendulum Testnet',
  rpc: 'wss://rpc-foucoco.pendulumchain.tech',
};

export const TESTNETS = [
  ROCOCO_CONTRACTS,
  PEAQ_AGUNG,
  PHALA_TESTNET,
  ASTAR_SHIBUYA,
  ALEPH_ZERO_TESTNET,
  T3RN_T0RN,
  PENDULUM_TESTNET,
  LOCAL,
];

export const MAINNETS = [ASTAR_SHIDEN];

export const DEFAULT_DECIMALS = 12;

export const MAX_CALL_WEIGHT = new BN(2_000_000_000_000);

export const NULL_CHAIN_PROPERTIES = {
  systemName: null,
  systemVersion: null,
  tokenDecimals: DEFAULT_DECIMALS,
  tokenSymbol: 'Unit',
};

export const INIT_STATE: ApiState = {
  ...NULL_CHAIN_PROPERTIES,
  endpoint: LOCAL.rpc,
  keyringStatus: null,
  error: null,
  status: 'CONNECT_INIT',
} as unknown as ApiState;
