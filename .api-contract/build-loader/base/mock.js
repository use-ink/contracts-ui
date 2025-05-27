// Copyright 2017-2025 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { TypeRegistry } from '@polkadot/types';
const registry = new TypeRegistry();
const instantiateWithCode = () => {
  throw new Error('mock');
};
instantiateWithCode.meta = { args: new Array(6) };
export const mockApi = {
  call: {
    contractsApi: {
      call: () => {
        throw new Error('mock');
      },
    },
  },
  isConnected: true,
  registry,
  tx: {
    contracts: {
      instantiateWithCode,
    },
  },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0VBQW9FO0FBQ3BFLHNDQUFzQztBQUl0QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztBQUVwQyxNQUFNLG1CQUFtQixHQUFHLEdBQVUsRUFBRTtJQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFCLENBQUMsQ0FBQztBQUVGLG1CQUFtQixDQUFDLElBQUksR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRWxELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRztJQUNyQixJQUFJLEVBQUU7UUFDSixZQUFZLEVBQUU7WUFDWixJQUFJLEVBQUUsR0FBVSxFQUFFO2dCQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFCLENBQUM7U0FDRjtLQUNGO0lBQ0QsV0FBVyxFQUFFLElBQUk7SUFDakIsUUFBUTtJQUNSLEVBQUUsRUFBRTtRQUNGLFNBQVMsRUFBRTtZQUNULG1CQUFtQjtTQUNwQjtLQUNGO0NBQytCLENBQUMifQ==
//# sourceHash=bd3465151b8164580ec2dd6e002983d8e01136aa60ec3ad49c9235e1510d9a6f
