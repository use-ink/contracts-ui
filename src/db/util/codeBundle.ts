import { nanoid } from 'nanoid';

export function getNewCodeBundleId(): string {
  return nanoid(8);
}
