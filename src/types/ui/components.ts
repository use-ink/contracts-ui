import { SubmittableExtrinsic, SubmittableResult } from '../substrate';
import { UseFormField } from './hooks';
import { FileState, SimpleSpread } from './util';

export interface OptionProps<T> {
  option: DropdownOption<T>;
  isPlaceholder?: boolean;
  isSelected?: boolean;
}

export interface DropdownOption<T> {
  value: T;
  name: React.ReactNode;
}

export type DropdownProps<T> = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  UseFormField<T> & {
    button?: React.ComponentType<OptionProps<T>>;
    isDisabled?: boolean;
    option?: React.ComponentType<OptionProps<T>>;
    options?: DropdownOption<T>[];
  }
>;

export type InputFileProps = SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    errorMessage?: React.ReactNode;
    isDisabled?: boolean;
    isSupplied?: boolean;
    isError?: boolean;
    onChange: (_: FileState) => void;
    onRemove: () => void;
    successMessage?: React.ReactNode;
    value?: FileState;
  }
>;

export interface RouteInterface {
  path: string;
  exact: boolean;
  fallback: NonNullable<React.ReactNode> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ComponentType<any>;
  routes?: RouteInterface[];
  redirect?: string;
}

export interface Transaction {
  id: number;
  isComplete?: boolean;
  isError?: boolean;
  isProcessing?: boolean;
  isSuccess?: boolean;
  extrinsic: SubmittableExtrinsic<'promise'>;
  accountId: string;
  isValid: (_: SubmittableResult) => boolean;
  onSuccess?: (_: SubmittableResult) => Promise<void>;
  onError?: () => void;
}

export type TransactionOptions = Pick<
  Transaction,
  'accountId' | 'extrinsic' | 'onSuccess' | 'onError' | 'isValid'
>;

export interface TransactionsState {
  txs: Transaction[];
  process: (_: number) => Promise<void>;
  queue: (_: TransactionOptions) => number;
  unqueue: (id: number) => void;
  dismiss: (id: number) => void;
}
