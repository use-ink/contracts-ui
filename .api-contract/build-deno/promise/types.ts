import type {
  BlueprintSubmittableResult as BaseBlueprintSubmittableResult,
  CodeSubmittableResult as BaseCodeSubmittableResult,
} from '../base/index.ts';

export type BlueprintSubmittableResult = BaseBlueprintSubmittableResult<'promise'>;
export type CodeSubmittableResult = BaseCodeSubmittableResult<'promise'>;
