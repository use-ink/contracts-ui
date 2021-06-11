import { BlueprintPromise } from '@polkadot/api-contract';
import { encodeSalt, createTx } from '../utils';
import { ApiPromise, InstantiateAction, Keyring, InstantiateState } from '../../types';

export const instantiateWithHash = async (
  endowment: number,
  gasLimit: number,
  api: ApiPromise | null,
  keyring: Keyring | null,
  keyringState: string | null,
  dispatch: (action: InstantiateAction) => void,
  { constructorName, argValues, fromAddress, codeHash, metadata }: InstantiateState
) => {
  if (codeHash && metadata && constructorName && api && fromAddress && keyringState === 'READY') {
    const salt = encodeSalt();
    const blueprint = new BlueprintPromise(api, metadata, codeHash);
    const options = { gasLimit, salt, value: endowment };
    const method = metadata.findConstructor(constructorName);
    const args = argValues ? Object.values(argValues) : [];
    const instantiate = createTx(blueprint, method, args, options);
    console.log(instantiate);

    dispatch({ type: 'INSTANTIATE' });
    const accountPair = keyring?.getPair(fromAddress);
    if (accountPair) {
      const unsub = await instantiate.signAndSend(
        accountPair,
        ({ status, events, dispatchError }) => {
          console.log('status', status);

          if (dispatchError) {
            console.log('error');

            dispatch({ type: 'INSTANTIATE_ERROR', payload: dispatchError });
          }
          if (status.isInBlock || status.isFinalized) {
            console.log('in block');
            dispatch({ type: 'INSTANTIATE_FINALIZED', payload: events });
          }
        }
      );
      unsub();
    }
  }
};
