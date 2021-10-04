import { UseFormField } from './hooks';
import { FileState, IsError, SimpleSpread } from './util';

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
  IsError & {
    errorMessage?: React.ReactNode;
    isDisabled?: boolean;
    isSupplied?: boolean;
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
