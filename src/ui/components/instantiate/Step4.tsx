// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { ApiContext } from 'ui/contexts';
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

export const Step4 = ({ state, dispatch, currentStep, submitHandler }: Props) => {
  if (currentStep !== 4) return null;

  return (
    <ApiContext.Consumer>
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
              variant="primary"
            >
              Instantiate
            </Button>
            <Button
              onClick={() =>
                dispatch({
                  type: 'GO_TO',
                  payload: { step: 3 },
                })
              }
            >
              Go Back
            </Button>
          </Buttons>
        </>
      )}
    </ApiContext.Consumer>
  );
};
