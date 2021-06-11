import React from 'react';
import { InstantiateState, InstantiateAction } from '../../types';
import { instantiateWithHash } from '../../canvas';
import { useCanvas } from '../../contexts';

interface Props {
  state: InstantiateState;
  dispatch: React.Dispatch<InstantiateAction>;
  currentStep: number;
}

const Step3 = ({ state, dispatch, currentStep }: Props) => {
  const { api, keyringState, keyring } = useCanvas();

  if (currentStep !== 3) return null;

  return (
    state && (
      <div className="w-full max-w-xl mt-8">
        <p>{`Account: ${state.fromAddress}`}</p>
        <p>{`Code hash: ${state.codeHash}`}</p>
        <p className="mb-8">{`Constructor: ${state.constructorName}`}</p>
        <button
          type="button"
          className="bg-gray-500 mr-4  text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() =>
            dispatch({
              type: 'GO_TO',
              payload: { step: 2 },
            })
          }
        >
          Back
        </button>
        <button
          type="button"
          className="bg-gray-500 mr-4  text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() =>
            instantiateWithHash(
              1300889614901161,
              155852802980,
              api,
              keyring,
              keyringState,
              dispatch,
              state
            )
          }
        >
          Instantiate
        </button>
      </div>
    )
  );
};

export default Step3;
