import { BlueprintPromise } from '@polkadot/api-contract';
import { handleDispatchError, saveInLocalStorage, encodeSalt } from '../utils';
import { ApiPromise, InstantiateAction, Keyring, InstantiateState, Abi } from '../../types';
import { getInstanceFromEvents } from './getAddressFromEvents';

export function createBlueprintTx(
  api: ApiPromise | null,
  options: { gasLimit: number; salt: Uint8Array; value: number },
  metadata?: Abi,
  codeHash?: string,
  constructorName?: string,
  argValues?: Record<string, string>
) {
  if (api && codeHash && constructorName && metadata && argValues) {
    const blueprint = new BlueprintPromise(api, metadata, codeHash);
    const expectedArgs = metadata.findConstructor(constructorName).args.length;
    const args = argValues ? Object.values(argValues) : [];

    return expectedArgs > 0
      ? blueprint.tx[constructorName](options, ...args)
      : blueprint.tx[constructorName](options);
  }
}

export const instantiateWithHash = async (
  endowment: number,
  gasLimit: number,
  api: ApiPromise | null,
  keyring: Keyring | null,
  keyringState: string | null,
  dispatch: (action: InstantiateAction) => void,
  { constructorName, argValues, fromAddress, codeHash, metadata }: InstantiateState
) => {
  const salt = encodeSalt();
  const options = { gasLimit, salt, value: endowment };
  const tx = createBlueprintTx(api, options, metadata, codeHash, constructorName, argValues);

  if (api && metadata && tx && fromAddress && keyring && keyringState === 'READY') {
    const accountPair = keyring.getPair(fromAddress);
    dispatch({ type: 'INSTANTIATE' });
    const unsub = await tx.signAndSend(accountPair, ({ status, events, dispatchError }) => {
      if (dispatchError) {
        handleDispatchError(dispatchError, api);
        dispatch({ type: 'INSTANTIATE_ERROR', payload: dispatchError });
      }
      if (status.isInBlock || status.isFinalized) {
        const contract = getInstanceFromEvents(events, api, metadata);
        if (contract) {
          saveInLocalStorage(contract);
          dispatch({ type: 'INSTANTIATE_SUCCESS', payload: contract });
        }
        unsub();
      }
    });
  }
};
