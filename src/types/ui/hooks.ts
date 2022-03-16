// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { VoidFn } from '../substrate';
import { BN, FileState, MetadataState, OrFalsy, SetState, Validation } from './util';

export type UseWeight = {
  defaultWeight: BN;
  estimatedWeight: OrFalsy<BN>;
  executionTime: number;
  isActive: boolean;
  isValid: boolean;
  megaGas: BN;
  percentage: number;
  setIsActive: SetState<boolean>;
  setMegaGas: React.Dispatch<BN | undefined>;
  weight: BN;
};

export interface ValidFormField<T> extends Validation {
  value: T;
  onChange: (_: OrFalsy<T>) => void;
}

export type UseBalance = ValidFormField<BN>;

export interface UseMetadata extends MetadataState {
  onChange: (_: FileState) => void;
  onRemove: () => void;
}

export type UseStepper = [number, VoidFn, VoidFn, React.Dispatch<number>];

export type UseToggle = [boolean, () => void, (value: boolean) => void];
