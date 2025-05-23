import { createVersionedExport } from '../util.ts';
import * as v0 from './v0/index.ts';
import * as v1 from './v1/index.ts';
import * as v2 from './v2/index.ts';
import * as v3 from './v3/index.ts';
import * as v4 from './v4/index.ts';
import * as v5 from './v5/index.ts';

export default createVersionedExport({ v0, v1, v2, v3, v4, v5 });
