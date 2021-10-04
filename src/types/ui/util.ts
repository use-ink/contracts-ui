import { Abi, AnyJson, BlueprintSubmittableResult, CodeSubmittableResult } from '../substrate';

export type SimpleSpread<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type UseState<T> = [T, SetState<T>];

export type OrFalsy<T> = T | null | undefined;

export type OrNull<T> = T | null;

export type OrUndef<T> = T | undefined;

export type StringOrNull = OrNull<string>;

export type ValidateFn<T> = (_: OrFalsy<T>) => ValidateResult;

export interface IsError {
  isError?: boolean;
}

export interface ValidateResult {
  isSuccess?: boolean;
  isValid?: boolean;
  isWarning?: boolean;
  message?: React.ReactNode;
}

export interface Validation extends ValidateResult, IsError {}

export interface FileState {
  data: Uint8Array;
  name: string;
  size: number;
}

export interface MetadataState extends Validation {
  source: AnyJson | null;
  name: string | null;
  value: Abi | null;
  isSupplied: boolean;
}

export type OnInstantiateSuccess$Code = (_: CodeSubmittableResult<'promise'>) => Promise<void>;
export type OnInstantiateSuccess$Hash = (_: BlueprintSubmittableResult<'promise'>) => Promise<void>;
