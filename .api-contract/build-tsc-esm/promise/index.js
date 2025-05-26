import { toPromiseMethod } from '@polkadot/api';
import {
  Blueprint,
  BlueprintRevive,
  Code,
  CodeRevive,
  Contract,
  ContractRevive,
} from '../base/index.js';
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
export class BlueprintRevivePromise extends BlueprintRevive {
  constructor(api, abi, codeHash) {
    super(api, abi, codeHash, toPromiseMethod);
  }
}
export class CodeRevivePromise extends CodeRevive {
  constructor(api, abi, wasm) {
    super(api, abi, wasm, toPromiseMethod);
  }
}
export class ContractRevivePromise extends ContractRevive {
  constructor(api, abi, address) {
    super(api, abi, address, toPromiseMethod);
  }
}
