import { ApiPromise, Keyring, ContractPromise, Abi, EventRecord, DispatchError } from './substrate';

export interface AppState {
  socket: string;
  keyring: Keyring | null;
  keyringState: string | null;
  api: ApiPromise | null;
  apiError: unknown;
  apiState: string | null;
}

export type Action =
  | { type: 'CONNECT_INIT' }
  | { type: 'CONNECT'; payload: ApiPromise }
  | { type: 'CONNECT_SUCCESS' }
  | { type: 'CONNECT_ERROR'; payload: unknown }
  | { type: 'LOAD_KEYRING' }
  | { type: 'SET_KEYRING'; payload: Keyring }
  | { type: 'KEYRING_ERROR' };

export interface InstantiateInput {
  constr: string;
  args?: string[];
}

export type ArgValues = Record<string, string | undefined>;

export type DropdownOption = {
  value: string | number;
  name: string;
};
export interface InstantiateState {
  isLoading: boolean;
  isSuccess: boolean;
  fromAddress?: string;
  codeHash?: string;
  metadata?: Abi;
  constructorName?: string;
  argValues?: Record<string, string>;
  contract?: ContractPromise | null;
  events?: EventRecord[];
  error?: DispatchError;
  currentStep: number;
}

export type InstantiateAction =
  | { type: 'INSTANTIATE' }
  | { type: 'INSTANTIATE_FINALIZED'; payload: EventRecord[] }
  | { type: 'INSTANTIATE_SUCCESS'; payload: ContractPromise }
  | { type: 'INSTANTIATE_ERROR'; payload: DispatchError }
  | { type: 'STEP_1_COMPLETE'; payload: { codeHash: string; metadata: Abi } }
  | {
      type: 'STEP_2_COMPLETE';
      payload: { fromAddress: string };
    }
  | {
      type: 'STEP_3_COMPLETE';
      payload: { constructorName: string; argValues: Record<string, string> };
    }
  | {
      type: 'GO_TO';
      payload: { step: number };
    };
