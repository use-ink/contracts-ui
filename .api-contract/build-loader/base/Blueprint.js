// Copyright 2017-2025 @polkadot/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { SubmittableResult } from '@polkadot/api';
import { BN_ZERO, isUndefined } from '@polkadot/util';
import { applyOnEvent } from '../util.js';
import { Base } from './Base.js';
import { Contract } from './Contract.js';
import { convertWeight, createBluePrintTx, encodeSalt } from './util.js';
export class BlueprintSubmittableResult extends SubmittableResult {
  contract;
  constructor(result, contract) {
    super(result);
    this.contract = contract;
  }
}
export class Blueprint extends Base {
  /**
   * @description The on-chain code hash for this blueprint
   */
  codeHash;
  #tx = {};
  constructor(api, abi, codeHash, decorateMethod) {
    super(api, abi, decorateMethod);
    this.codeHash = this.registry.createType('Hash', codeHash);
    this.abi.constructors.forEach(c => {
      if (isUndefined(this.#tx[c.method])) {
        this.#tx[c.method] = createBluePrintTx(c, (o, p) => this.#deploy(c, o, p));
      }
    });
  }
  get tx() {
    return this.#tx;
  }
  #deploy = (
    constructorOrId,
    { gasLimit = BN_ZERO, salt, storageDepositLimit = null, value = BN_ZERO },
    params,
  ) => {
    return this.api.tx.contracts
      .instantiate(
        value,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore jiggle v1 weights, metadata points to latest
        this._isWeightV1 ? convertWeight(gasLimit).v1Weight : convertWeight(gasLimit).v2Weight,
        storageDepositLimit,
        this.codeHash,
        this.abi.findConstructor(constructorOrId).toU8a(params),
        encodeSalt(salt),
      )
      .withResultTransform(
        result =>
          new BlueprintSubmittableResult(
            result,
            applyOnEvent(
              result,
              ['Instantiated'],
              ([record]) =>
                new Contract(this.api, this.abi, record.event.data[1], this._decorateMethod),
            ),
          ),
      );
  };
}
export function extendBlueprint(type, decorateMethod) {
  return class extends Blueprint {
    static __BlueprintType = type;
    constructor(api, abi, codeHash) {
      super(api, abi, codeHash, decorateMethod);
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmx1ZXByaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQmx1ZXByaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9FQUFvRTtBQUNwRSxzQ0FBc0M7QUFXdEMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFlBQVksQ0FBQztBQUMxQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFJekUsTUFBTSxPQUFPLDBCQUFxRCxTQUFRLGlCQUFpQjtJQUNoRixRQUFRLENBQWlDO0lBRWxELFlBQWEsTUFBMEIsRUFBRSxRQUE0QjtRQUNuRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sU0FBb0MsU0FBUSxJQUFhO0lBQ3BFOztPQUVHO0lBQ00sUUFBUSxDQUFPO0lBRWYsR0FBRyxHQUFnQyxFQUFFLENBQUM7SUFFL0MsWUFBYSxHQUFxQixFQUFFLEdBQTJDLEVBQUUsUUFBb0MsRUFBRSxjQUF1QztRQUM1SixLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQVEsRUFBRTtZQUN4QyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdFLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFXLEVBQUU7UUFDWCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbEIsQ0FBQztJQUVELE9BQU8sR0FBRyxDQUFDLGVBQWlELEVBQUUsRUFBRSxRQUFRLEdBQUcsT0FBTyxFQUFFLElBQUksRUFBRSxtQkFBbUIsR0FBRyxJQUFJLEVBQUUsS0FBSyxHQUFHLE9BQU8sRUFBb0IsRUFBRSxNQUFpQixFQUFzRSxFQUFFO1FBQ2xQLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FDdEMsS0FBSztRQUNMLDZEQUE2RDtRQUM3RCwwREFBMEQ7UUFDMUQsSUFBSSxDQUFDLFdBQVc7WUFDZCxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVE7WUFDbEMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQ3BDLG1CQUFtQixFQUNuQixJQUFJLENBQUMsUUFBUSxFQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFDdkQsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUNqQixDQUFDLG1CQUFtQixDQUFDLENBQUMsTUFBMEIsRUFBRSxFQUFFLENBQ25ELElBQUksMEJBQTBCLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFnQixFQUFFLEVBQUUsQ0FDeEcsSUFBSSxRQUFRLENBQVUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBYyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FDbkcsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDLENBQUM7Q0FDSDtBQUVELE1BQU0sVUFBVSxlQUFlLENBQTZCLElBQWEsRUFBRSxjQUF1QztJQUNoSCxPQUFPLEtBQU0sU0FBUSxTQUFrQjtRQUNyQyxNQUFNLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUU5QixZQUFhLEdBQXFCLEVBQUUsR0FBMkMsRUFBRSxRQUFvQztZQUNuSCxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDIn0=
//# sourceHash=95d66631261e83981b8a14bbfca55e6d6541bf3fcebe6a13472322b3d1b5e7ed
