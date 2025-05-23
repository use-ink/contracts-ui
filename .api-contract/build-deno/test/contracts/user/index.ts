import { createVersionedExport } from '../util.ts';
import * as v0 from './v0/index.ts';
import * as v3 from './v3/index.ts';
import * as v4 from './v4/index.ts';

export default createVersionedExport({ v0, v3, v4 });
