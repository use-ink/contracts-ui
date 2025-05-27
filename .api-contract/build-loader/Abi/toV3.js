// Copyright 2017-2025 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { objectSpread } from '@polkadot/util';
export function v2ToV3(registry, v2) {
  return registry.createType(
    'ContractMetadataV3',
    objectSpread({}, v2, {
      spec: objectSpread({}, v2.spec, {
        constructors: v2.spec.constructors.map(c =>
          // V3 introduces the payable flag on constructors, for <V3, it is always true
          registry.createType('ContractConstructorSpecV3', objectSpread({}, c, { payable: true })),
        ),
      }),
    }),
  );
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9WMy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvVjMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0VBQW9FO0FBQ3BFLHNDQUFzQztBQUt0QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUMsTUFBTSxVQUFVLE1BQU0sQ0FBRSxRQUFrQixFQUFFLEVBQXNCO0lBQ2hFLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNwRSxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFO1lBQzlCLFlBQVksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUMzQyw2RUFBNkU7WUFDN0UsUUFBUSxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsRUFBRSxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQ3pGO1NBQ0YsQ0FBQztLQUNILENBQUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQyJ9
//# sourceHash=1460720e838dc8b16a0eeb6a569b204439d065dec02764ae6700465f10fb96af
