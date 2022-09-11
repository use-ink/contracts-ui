// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { VoidFn } from '../substrate';
import { BN, FileState, MetadataState, Validation } from './util';

export type InputMode = 'estimation' | 'custom';

export type UseWeight = {
  defaultWeight: BN;
  estimatedWeight?: BN;
  isValid: boolean;
  megaGas: BN;
  setMegaGas: React.Dispatch<BN>;
  weight: BN;
  mode?: InputMode;
};

export interface ValidFormField<T> extends Validation {
  value: T;
  onChange: (_: T) => void;
}

export type UseBalance = ValidFormField<BN>;

export interface UseMetadata extends MetadataState {
  onChange: (_: FileState) => void;
  onRemove: () => void;
}

export type UseStepper = [number, VoidFn, VoidFn, React.Dispatch<number>];

export type UseToggle = [boolean, () => void, (value: boolean) => void];
