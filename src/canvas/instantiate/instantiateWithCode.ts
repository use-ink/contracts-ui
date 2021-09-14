/* eslint-disable indent */
// import BN from 'bn.js';
import { SubmittableExtrinsic } from "@polkadot/api/types";
// import { Abi, CodePromise } from "@polkadot/api-contract";
// import { handleDispatchError, saveInLocalStorage } from 'canvas/util';
import { ApiPromise, InstantiateAction, InstantiateState, Keyring } from "types";

export const instantiateWithCode = async (
    api: ApiPromise | null,
    keyring: Keyring | null,
    keyringState: string | null,
    dispatch: (action: InstantiateAction) => void,
    uploadTx: SubmittableExtrinsic<'promise'> | null,
    error: string | null,
    { fromAddress, metadata }: InstantiateState,
) => {
    if (error) console.error(error);

    if (api && metadata && uploadTx && fromAddress && keyring && keyringState === 'READY') {
        const accountPair = keyring.getPair(fromAddress);
        dispatch({ type: 'INSTANTIATE' });

        const unsub = await uploadTx.signAndSend(accountPair, ({ status, /*events,*/ dispatchError }) => {
            if (dispatchError) {
                //
            }
            if (status.isInBlock || status.isFinalized) {
                //
                unsub();
            }
        });
    }
};


