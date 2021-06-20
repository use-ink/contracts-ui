import { BlueprintPromise } from '@polkadot/api-contract';
import { handleDispatchError, saveInLocalStorage, encodeSalt } from '../utils';
import { ApiPromise, InstantiateAction, Keyring, InstantiateState } from '../../types';
import { getInstanceFromEvents } from './getAddressFromEvents';

export const instantiateWithHash = async (
  endowment: number,
  gasLimit: number,
  api: ApiPromise | null,
  keyring: Keyring | null,
  keyringState: string | null,
  dispatch: (action: InstantiateAction) => void,
  { constructorName, argValues, fromAddress, codeHash, metadata }: InstantiateState
) => {
  if (
    argValues &&
    codeHash &&
    metadata &&
    constructorName &&
    api &&
    fromAddress &&
    keyringState === 'READY'
  ) {
    const salt = encodeSalt();
    const blueprint = new BlueprintPromise(api, metadata, codeHash);
    const options = { gasLimit, salt, value: endowment };
    const expectedArgs = metadata.findConstructor(constructorName).args.length;
    const args = argValues ? Object.values(argValues) : [];
    const tx =
      expectedArgs > 0
        ? blueprint.tx[constructorName](options, ...args)
        : blueprint.tx[constructorName](options);
    const accountPair = keyring?.getPair(fromAddress);
    if (accountPair) {
      dispatch({ type: 'INSTANTIATE' });
      const unsub = await tx.signAndSend(accountPair, ({ status, events, dispatchError }) => {
        if (dispatchError) {
          handleDispatchError(dispatchError, api);
          dispatch({ type: 'INSTANTIATE_ERROR', payload: dispatchError });
        }
        if (status.isInBlock || status.isFinalized) {
          const contract = getInstanceFromEvents(events, api, metadata);
          if (contract) {
            console.log(contract);
            saveInLocalStorage(contract);
            dispatch({ type: 'INSTANTIATE_SUCCESS', payload: contract });
          }
          unsub();
        }
      });
    }
  }
};
