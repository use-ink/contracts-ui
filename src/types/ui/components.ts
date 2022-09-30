// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Props as ReactSelectProps } from 'react-select';
import { Registry, TypeDef } from '../substrate';
import { ValidFormField } from './hooks';
import { FileState, OrFalsy, SimpleSpread } from './util';

export interface DropdownOption<T> {
  value: T;
  label: React.ReactNode;
}

export type ArgComponentProps<T, C = HTMLDivElement> = SimpleSpread<
  React.HTMLAttributes<C>,
  ValidFormField<T>
> & {
  nestingNumber: number;
  registry: Registry;
  typeDef: TypeDef;
};

export type DropdownProps<T> = SimpleSpread<
  React.HTMLAttributes<HTMLDivElement>,
  ValidFormField<T> &
    Pick<
      ReactSelectProps<DropdownOption<T>, false>,
      'components' | 'formatOptionLabel' | 'isDisabled' | 'isSearchable' | 'options' | 'placeholder'
    >
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
    value: OrFalsy<FileState>;
  }
>;
