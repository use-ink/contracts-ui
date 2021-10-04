import { Database, MyContracts, PrivateKey, UserDocument } from '../db';
import {
  Abi,
  AbiMessage,
  AnyJson,
  ApiPromise,
  Keyring,
  KeyringPair,
  RegistryError,
  AbiConstructor,
  BlueprintPromise,
  ContractPromise,
  SubmittableExtrinsic,
} from '../substrate';
import { UseBalance, UseFormField, UseMetadata, UseStepper, UseToggle, UseWeight } from './hooks';
import { FileState, OnInstantiateSuccess$Code, OnInstantiateSuccess$Hash, UseState } from './util';

type Status = 'CONNECT_INIT' | 'CONNECTING' | 'READY' | 'ERROR' | 'LOADING';

export interface CanvasState extends ChainProperties {
  endpoint: string;
  keyring: Keyring;
  keyringStatus: string | null;
  api: ApiPromise;
  error: unknown | null;
  status: Status;
}

export type CanvasAction =
  | { type: 'CONNECT_INIT' }
  | { type: 'CONNECT'; payload: ApiPromise }
  | { type: 'CONNECT_READY'; payload: Partial<ChainProperties> }
  | { type: 'CONNECT_ERROR'; payload: unknown }
  | { type: 'LOAD_KEYRING' }
  | { type: 'SET_ENDPOINT'; payload: string }
  | { type: 'SET_KEYRING'; payload: Keyring }
  | { type: 'KEYRING_ERROR' };

export interface ChainProperties {
  blockZeroHash: string | null;
  tokenDecimals: number;
  systemName: string | null;
  systemVersion: string | null;
  tokenSymbol: string;
}

export interface DbState {
  db: Database;
  user: UserDocument | null;
  myContracts: MyContracts | null;
  refreshUserData: () => void;
  identity: PrivateKey | null;
  isDbReady: boolean;
}

export interface InstantiateState {
  accountId: UseFormField<string | null>;
  argValues: UseState<Record<string, unknown>>;
  codeHash?: string | null;
  constructorIndex: UseFormField<number>;
  deployConstructor: AbiConstructor | null;
  endowment: UseBalance;
  isLoading: boolean;
  isUsingSalt: UseToggle;
  isUsingStoredMetadata: UseToggle;
  metadata: UseMetadata;
  metadataFile: UseState<FileState | undefined>;
  name: UseFormField<string>;
  onError: () => void;
  onFinalize?: () => void;
  onUnFinalize?: () => void;
  onInstantiate: OnInstantiateSuccess$Code | OnInstantiateSuccess$Hash;
  onSuccess: (_: ContractPromise, __?: BlueprintPromise | undefined) => void;
  salt: UseFormField<string>;
  step: UseStepper;
  weight: UseWeight;
  tx: SubmittableExtrinsic<'promise'> | null;
  txError: string | null;
}

export interface ContractCallParams {
  api: ApiPromise;
  abi: Abi;
  contractAddress: string;
  message: AbiMessage;
  endowment: number;
  gasLimit: number;
  keyringPair?: KeyringPair;
  argValues?: Record<string, unknown>;
  dispatch: (action: ContractCallAction) => void;
}

export interface CallResult {
  data: AnyJson;
  id: number;
  isComplete: boolean;
  log: string[];
  message: AbiMessage;
  blockHash?: string;
  error?: RegistryError;
  info?: Record<string, AnyJson>;
  time: number;
}

export interface ContractCallState {
  isLoading: boolean;
  isSuccess: boolean;
  results: CallResult[];
  error?: RegistryError;
}

export type ContractCallAction =
  | { type: 'CALL_INIT'; payload: CallResult }
  | { type: 'CALL_FINALISED'; payload: CallResult };

export type UrlParams = { address: string; activeTab: string };
