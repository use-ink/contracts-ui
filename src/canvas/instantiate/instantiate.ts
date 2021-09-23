import { BlueprintPromise, CodePromise, ContractPromise } from '@polkadot/api-contract';
import { isNumber } from '@polkadot/util';
import type { BlueprintSubmittableResult, CodeSubmittableResult } from '@polkadot/api-contract/base';
import { handleDispatchError, encodeSalt, transformUserInput } from '../util';
import type { ApiPromise, Abi, BN, InstantiateState, CanvasState, DbState } from 'types';
import { createCodeBundle, createContract, findCodeBundleByHash } from 'db';

function createUploadTx(
  api: ApiPromise | null,
  options: { gasLimit: BN; salt: Uint8Array; value?: BN },
  metadata?: Abi,
  constructorIndex?: number,
  argValues?: Record<string, unknown>
) {
  const wasm = metadata?.project.source.wasm;

  if (api && !!wasm && isNumber(constructorIndex) && metadata && argValues) {
    const code = new CodePromise(api, metadata, wasm.toU8a());
    const constructor = metadata.findConstructor(constructorIndex);
  
    const transformed = transformUserInput(constructor.args, Object.values(argValues) as any);

    return constructor.args.length > 0
      ? code.tx[constructor.method](options, ...transformed)
      : code.tx[constructor.method](options);
  }
}

function createBlueprintTx(
  api: ApiPromise | null,
  options: { gasLimit: BN; salt: Uint8Array; value?: BN },
  metadata?: Abi,
  codeHash?: string,
  constructorIndex?: number,
  argValues?: Record<string, unknown>
) {
  if (api && codeHash && isNumber(constructorIndex) && metadata && argValues) {
    const blueprint = new BlueprintPromise(api, metadata, codeHash);
    const constructor = metadata.findConstructor(constructorIndex);
  
    const transformed = transformUserInput(constructor.args, Object.values(argValues) as any);

    return constructor.args.length > 0
      ? blueprint.tx[constructor.method](options, ...transformed)
      : blueprint.tx[constructor.method](options);
  }
}

export async function instantiate (
  { api, blockOneHash, keyring }: CanvasState,
  { db, identity }: DbState,
  {
    accountId,
    argValues: [argValues],
    codeHash,
    constructorIndex,
    weight: { weight: gasLimit },
    endowment,
    metadata,
    name,
    salt
  }: InstantiateState,
  onSuccess?: (_: ContractPromise, __?: BlueprintPromise) => void
): Promise<void> {
  const isFromHash = !!codeHash;
  const saltu8a = encodeSalt(salt.value);
  const options = {
    gasLimit,
    salt: saltu8a,
    value: endowment.value || undefined
  };
  const tx = isFromHash
    ? createBlueprintTx(api, options, metadata.value as Abi, codeHash, constructorIndex.value, argValues)
    : createUploadTx(api, options, metadata.value as Abi, constructorIndex.value, argValues)

  if (api && metadata && tx && accountId.value && keyring) {
    const account = keyring.getPair(accountId.value);

    const unsub = await tx.signAndSend(
      account,
      {},
      isFromHash
        ? async ({ contract, dispatchError, status }: BlueprintSubmittableResult<'promise'>) => {
          if (dispatchError) {
            handleDispatchError(dispatchError, api);
          }

          const codeBundle = await findCodeBundleByHash(db, { blockOneHash, codeHash });

          if (contract && (status.isInBlock || status.isFinalized)) {
            await createContract(
              db,
              identity,
              {
                abi: contract.abi.json as Record<string, unknown>,
                address: contract.address.toString(),
                blockOneHash: blockOneHash || undefined,
                codeBundleId: codeBundle?.id,
                genesisHash: api?.genesisHash.toString(),
                name: name.value,
                tags: []
              }
            )

            onSuccess && onSuccess(contract);

          }
        }
        
        : async ({ blueprint, contract, dispatchError, status }: CodeSubmittableResult<'promise'>) => {
          if (dispatchError) {
            handleDispatchError(dispatchError, api);
          }

          if (blueprint && contract && (status.isInBlock || status.isFinalized)) {
            const { id: codeBundleId } = await createCodeBundle(
              db,
              identity,
              {
                abi: blueprint.abi.json as Record<string, unknown>,
                blockOneHash: blockOneHash || undefined,
                codeHash: blueprint.codeHash.toHex(),
                genesisHash: api.genesisHash.toHex(),
                name: blueprint.abi.project.contract.name.toString(),
                tags: []
              }
            );

            await createContract(
              db,
              identity,
              {
                abi: contract.abi.json as Record<string, unknown>,
                address: contract.address.toString(),
                blockOneHash: blockOneHash || undefined,
                codeBundleId,
                genesisHash: api?.genesisHash.toString(),
                name: name.value,
                tags: []
              }
            )
            // const contract = getInstanceFromEvents(events, api, metadata.value as Abi);
            onSuccess && onSuccess(contract, blueprint);
            
            unsub();
          }
        }
      )
        
  }
};
