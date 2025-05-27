// Copyright 2017-2025 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0
/// <reference types="@polkadot/dev-test/globals.d.ts" />
import fs from 'node:fs';
import { toPromiseMethod } from '@polkadot/api';
import v0contractFlipper from '../test/contracts/ink/v0/flipper.contract.json' with { type: 'json' };
import v0abiFlipper from '../test/contracts/ink/v0/flipper.json' with { type: 'json' };
import v1contractFlipper from '../test/contracts/ink/v1/flipper.contract.json' with { type: 'json' };
import { Code } from './Code.js';
import { mockApi } from './mock.js';
const v0wasmFlipper = fs.readFileSync(
  new URL('../test/contracts/ink/v0/flipper.wasm', import.meta.url),
  'utf-8',
);
describe('Code', () => {
  it('can construct with an individual ABI/WASM combo', () => {
    expect(() => new Code(mockApi, v0abiFlipper, v0wasmFlipper, toPromiseMethod)).not.toThrow();
  });
  it('can construct with an .contract ABI (v0)', () => {
    expect(() => new Code(mockApi, v0contractFlipper, null, toPromiseMethod)).not.toThrow();
  });
  it('can construct with an .contract ABI (v1)', () => {
    expect(() => new Code(mockApi, v1contractFlipper, null, toPromiseMethod)).not.toThrow();
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ29kZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9FQUFvRTtBQUNwRSxzQ0FBc0M7QUFFdEMseURBQXlEO0FBRXpELE9BQU8sRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUV6QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWhELE9BQU8saUJBQWlCLE1BQU0sZ0RBQWdELENBQUMsT0FBTyxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDckcsT0FBTyxZQUFZLE1BQU0sdUNBQXVDLENBQUMsT0FBTyxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7QUFDdkYsT0FBTyxpQkFBaUIsTUFBTSxnREFBZ0QsQ0FBQyxPQUFPLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztBQUNyRyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFcEMsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEdBQUcsQ0FBQyx1Q0FBdUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRWxILFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBUyxFQUFFO0lBQzFCLEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxHQUFTLEVBQUU7UUFDL0QsTUFBTSxDQUNKLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxZQUF1QyxFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUMsQ0FDakcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBUyxFQUFFO1FBQ3hELE1BQU0sQ0FDSixHQUFHLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsaUJBQTRDLEVBQUUsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUM3RixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxHQUFTLEVBQUU7UUFDeEQsTUFBTSxDQUNKLEdBQUcsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxpQkFBNEMsRUFBRSxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQzdGLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==
//# sourceHash=acc22862406c09d74038e177bdfd23410b59476ef183cafd9e800c80ff6cda3d
