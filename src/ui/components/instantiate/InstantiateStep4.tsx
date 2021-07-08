import React from 'react';
import { InstantiateState, InstantiateAction } from '../../types';
import { ApiPromise, Keyring } from '../../../canvas/types';
import { CanvasContext } from '../../contexts';

interface Props {
  state: InstantiateState;
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep: number;
  submitHandler: (
    endowment: number,
    gasLimit: number,
    api: ApiPromise | null,
    keyring: Keyring | null,
    keyringState: string | null,
    dispatch: (action: InstantiateAction) => void,
    { constructorName, argValues, fromAddress, codeHash, metadata }: InstantiateState
  ) => void;
}

const Step4 = ({ state, dispatch, currentStep, submitHandler }: Props) => {
  if (currentStep !== 4) return null;

  return (
    <CanvasContext.Consumer>
      {({ api, keyring, keyringStatus }) => (
        <>
          <p>{`Account: ${state.fromAccountName}`}</p>
          <p>{`Name: ${state.contractName}`}</p>
          <p>{`Code hash: ${state.codeHash}`}</p>
          <p className="mb-8">{`Constructor: ${state.constructorName}`}</p>

          <button
            type="button"
            className="bg-gray-500 mr-4 text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              submitHandler(
                1300889614901161,
                155852802980,
                api,
                keyring,
                keyringStatus,
                dispatch,
                state
              )
            }
          >
            Instantiate
          </button>
          <button
            type="button"
            className="bg-gray-500  text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              dispatch({
                type: 'GO_TO',
                payload: { step: 3 },
              })
            }
          >
            Go Back
          </button>
        </>
      )}
    </CanvasContext.Consumer>
  );
};

export default Step4;
