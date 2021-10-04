import React from 'react';
import type { BN, VoidFn } from '../substrate';
import type { FileState, MetadataState, OrFalsy, SetState, Validation } from './util';

export interface UseFormField<T> extends Validation {
  isTouched?: boolean;
  value?: OrFalsy<T>;
  onChange: (_: T) => void;
}

export type UseBalance = UseFormField<BN | null | undefined>;

export interface UseQuery<T> {
  data: T | null;
  isLoading: boolean;
  isValid: boolean;
  refresh: VoidFn;
  updated: number;
}

export type UseToggle = [boolean, VoidFn, SetState<boolean>];

export type UseStepper = [number, VoidFn, VoidFn, React.Dispatch<number>];

export interface UseMetadata extends MetadataState {
  onChange: (_: FileState) => void;
  onRemove: () => void;
}

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
