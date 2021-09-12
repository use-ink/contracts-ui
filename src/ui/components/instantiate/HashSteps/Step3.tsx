import React from 'react';
import { Button } from 'ui/components/Button';
import { Buttons } from 'ui/components/Buttons';
import { CanvasContext } from 'ui/contexts';
import type { ApiPromise, Keyring, InstantiateState, InstantiateAction } from 'types';

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

export const Step3 = ({ state, dispatch, currentStep, submitHandler }: Props) => {
  if (currentStep !== 3) return null;

  return (
    <CanvasContext.Consumer>
      {({ api, keyring, keyringStatus }) => (
        <>
          <div className="dark:text-gray-300 text-gray-700">
            <p>{`Account: ${state.fromAccountName}`}</p>
            <p>{`Name: ${state.contractName}`}</p>
            <p>{`Code hash: ${state.codeHash}`}</p>
            <p className="mb-8">{`Constructor: ${state.constructorName}`}</p>
          </div>

          <Buttons>
            <Button
              className="mr-4"
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
              variant='primary'
            >
              Instantiate
            </Button>
            <Button
              onClick={() =>
                dispatch({
                  type: 'GO_TO',
                  payload: { step: currentStep - 1 },
                })
              }
            >
              Go Back
            </Button>
          </Buttons>
        </>
      )}
    </CanvasContext.Consumer>
  );
};
