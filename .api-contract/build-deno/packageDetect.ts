import { packageInfo as apiInfo } from 'https://deno.land/x/polkadot/api/packageInfo.ts';
import { packageInfo as typesInfo } from 'https://deno.land/x/polkadot/types/packageInfo.ts';
import { detectPackage } from 'https://deno.land/x/polkadot/util/mod.ts';

import { packageInfo } from './packageInfo.ts';

detectPackage(packageInfo, null, [apiInfo, typesInfo]);
