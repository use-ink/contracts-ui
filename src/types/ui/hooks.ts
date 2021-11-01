// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VoidFn } from '../substrate';
import { BN, FileState, MetadataState, SetState, Validation } from './util';

export interface UseWeight {
  executionTime: number;
  isEmpty: boolean;
  isValid: boolean;
  megaGas: BN;
  percentage: number;
  setIsEmpty: SetState<boolean>;
  setMegaGas: React.Dispatch<BN | undefined>;
  weight: BN;
}

export interface UseFormField<T> extends Validation {
  value?: T;
  onChange: (_: T) => void;
}

export type UseBalance = UseFormField<BN | null | undefined>;

export interface UseMetadata extends MetadataState {
  onChange: (_: FileState) => void;
  onRemove: () => void;
}

export type UseStepper = [number, VoidFn, VoidFn, React.Dispatch<number>];

export type UseToggle = [boolean, () => void, (value: boolean) => void];
