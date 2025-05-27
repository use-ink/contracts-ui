// Copyright 2017-2025 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0
export function createVersionedExport(versioned) {
  const result = {};
  Object.entries(versioned).forEach(([version, contracts]) =>
    Object.entries(contracts).forEach(([name, contract]) => {
      result[`${version}_${name}`] = contract;
    }),
  );
  return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0VBQW9FO0FBQ3BFLHNDQUFzQztBQUV0QyxNQUFNLFVBQVUscUJBQXFCLENBQUUsU0FBa0Q7SUFDdkYsTUFBTSxNQUFNLEdBQTRDLEVBQUUsQ0FBQztJQUUzRCxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQUUsQ0FDekQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBUSxFQUFFO1FBQzNELE1BQU0sQ0FBQyxHQUFHLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLFFBQW1DLENBQUM7SUFDckUsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUVGLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMifQ==
//# sourceHash=2d56165bfc8508292e9a640db45adaab8186b0721a7e02aa5a47b14ecb5f7509
