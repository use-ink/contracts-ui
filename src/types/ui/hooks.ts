import React from "react"
import type { VoidFn } from "../substrate";

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export interface UseQuery<T> {
  data: T | null;
  isLoading: boolean;
  isValid: boolean;
  refresh: VoidFn;
  updated: number;
}

export type UseToggle = [boolean, VoidFn, SetState<boolean>];

