/* eslint-disable indent */
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { getInstanceFromEvents } from './getAddressFromEvents';
import { handleDispatchError, saveInLocalStorage } from 'canvas/util';
import { ApiPromise, InstantiateAction, InstantiateState, Keyring } from "types";

export const instantiateWithCode = async (
    api: ApiPromise | null,
    keyring: Keyring | null,
    keyringState: string | null,
    dispatch: (action: InstantiateAction) => void,
    uploadTransaction: SubmittableExtrinsic<'promise'> | null,
    uploadTransactionError: string | null,
    { fromAddress, metadata }: InstantiateState,
) => {
    if (uploadTransactionError) console.error(uploadTransactionError);

    if (api && metadata && uploadTransaction && fromAddress && keyring && keyringState === 'READY') {
        const accountPair = keyring.getPair(fromAddress);
        dispatch({ type: 'INSTANTIATE' });
        const unsub = await uploadTransaction.signAndSend(accountPair, ({ status, events, dispatchError }) => {
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
