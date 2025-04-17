import { toPromiseMethod } from '@polkadot/api';
import { Blueprint, Code, Contract } from '../base/index.js';
export class BlueprintPromise extends Blueprint {
  constructor(api, abi, codeHash) {
    super(api, abi, codeHash, toPromiseMethod);
  }
}
export class CodePromise extends Code {
  constructor(api, abi, wasm) {
    super(api, abi, wasm, toPromiseMethod);
  }
}
export class ContractPromise extends Contract {
  constructor(api, abi, address) {
    super(api, abi, address, toPromiseMethod);
  }
}
