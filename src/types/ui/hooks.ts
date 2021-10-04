import React from "react"
import type { OrFalsy, VoidFn } from "types";

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type ValidateFn<T> = (_: OrFalsy<T>) => Validation;

export interface Validation {
  isValid?: boolean;
  isWarning?: boolean;
  message?: React.ReactNode;
}

export interface UseFormField<T> extends Validation {
  isError?: boolean;
  isTouched?: boolean;
  value?: OrFalsy<T>;
  onChange: (_: T) => void;
};

export interface UseQuery<T> {
  data: T | null;
  isLoading: boolean;
  isValid: boolean;
  refresh: VoidFn;
  updated: number;
}

export type UseToggle = [boolean, VoidFn, SetState<boolean>];

