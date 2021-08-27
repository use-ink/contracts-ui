// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import type { StorageKey, Option } from '@polkadot/types';
import type { CodeHash, PrefabWasmModule } from '@polkadot/types/interfaces/contracts';

// types & interfaces
export type { AnyJson, ISubmittableResult, RegistryError } from '@polkadot/types/types';
export type { DispatchError, EventRecord } from '@polkadot/types/interfaces';
export type { CodeHash, PrefabWasmModule } from '@polkadot/types/interfaces/contracts';
export type { KeyringPair } from '@polkadot/keyring/types';
export type { AbiMessage, AbiParam } from '@polkadot/api-contract/types';
export type { ContractQuery, ContractTx } from '@polkadot/api-contract/base/types';
export type { SubmittableExtrinsic } from '@polkadot/api/types';

// classes
export { Bytes, StorageKey, Option } from '@polkadot/types';
export { Keyring } from '@polkadot/ui-keyring';
export { Abi, ContractPromise, BlueprintPromise } from '@polkadot/api-contract';
export { ApiPromise } from '@polkadot/api';

export type StorageEntry = [StorageKey<[CodeHash]>, Option<PrefabWasmModule>];
