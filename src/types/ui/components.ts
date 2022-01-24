// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Props as ReactSelectProps } from 'react-select';
import { ValidFormField } from './hooks';
import { FileState, SimpleSpread } from './util';

export interface DropdownOption<T> {
  value: T;
  label: React.ReactNode;
}

export type DropdownProps<T> = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  ValidFormField<T> &
    Pick<
      ReactSelectProps<DropdownOption<T>, false>,
      'formatOptionLabel' | 'isDisabled' | 'isSearchable' | 'options' | 'placeholder'
    >
>;

// export interface OptionProps<T> {
//   option: DropdownOption<T>;
//   isPlaceholder?: boolean;
//   isSelected?: boolean;
// }

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
