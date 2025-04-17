import type {
  BlueprintSubmittableResult as BaseBlueprintSubmittableResult,
  CodeSubmittableResult as BaseCodeSubmittableResult,
} from '../base/index.js';
export type BlueprintSubmittableResult = BaseBlueprintSubmittableResult<'promise'>;
export type CodeSubmittableResult = BaseCodeSubmittableResult<'promise'>;
