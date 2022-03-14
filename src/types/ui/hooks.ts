import { VoidFn } from '../substrate';
import { BN, FileState, MetadataState, OrFalsy, SetState, Validation } from './util';

export type UseWeight = {
  executionTime: number;
  isEmpty: boolean;
  isValid: boolean;
  megaGas: BN;
  percentage: number;
  setIsEmpty: SetState<boolean>;
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
