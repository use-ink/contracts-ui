// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ValidFormField } from './hooks';
import { FileState, SimpleSpread } from './util';

export interface DropdownOption<T> {
  value: T;
  name: React.ReactNode;
}

export type DropdownProps<T> = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  ValidFormField<T> & {
    button?: React.ComponentType<OptionProps<T>>;
    isDisabled?: boolean;
    option?: React.ComponentType<OptionProps<T>>;
    options?: DropdownOption<T>[];
  }
>;

export interface OptionProps<T> {
  option: DropdownOption<T>;
  isPlaceholder?: boolean;
  isSelected?: boolean;
}

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
