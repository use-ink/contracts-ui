import type { JSONSchema4 } from 'json-schema';

import codeBundleSchema from './codeBundle.schema.json';
import contractSchema from './contract.schema.json';
import userSchema from './user.schema.json';

export const user = userSchema as JSONSchema4;
export const codeBundle = codeBundleSchema as JSONSchema4;
export const contract = contractSchema as JSONSchema4;
