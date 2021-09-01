import React, { useMemo, useEffect, useState } from 'react';
import { CodePromise } from '@polkadot/api-contract';
import { Identicon } from '@polkadot/react-identicon';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ApiPromise, Keyring, InstantiateState, InstantiateAction, RawParam } from 'types';
import { CanvasContext } from 'ui/contexts';

interface Props {
  state: InstantiateState;
  dispatch: React.Dispatch<InstantiateAction>;
  api: ApiPromise;
  currentStep: number;
  submitHandler: (
    api: ApiPromise | null,
    keyring: Keyring | null,
    keyringState: string | null,
    dispatch: (action: InstantiateAction) => void,
    uploadTx: SubmittableExtrinsic<'promise'> | null,
    error: string | null,
    { fromAddress, metadata }: InstantiateState
  ) => void;
}

function extractValues(values: RawParam[]) {
  return values.map(({ value }) => value);
}

export const Step3 = ({ state, dispatch, api, currentStep, submitHandler }: Props) => {
  const { endowment, metadata, gas, file } = state;
  const [[uploadTx, error], setUploadTx] = useState<
    [SubmittableExtrinsic<'promise'> | null, string | null]
  >([null, null]);
  const [constructorIndex /*, setConstructorIndex*/] = useState<number>(0);
  const [params, setParams] = useState<RawParam[]>([]);

  const code = useMemo(
    () => (api && metadata ? new CodePromise(api, metadata, file?.data) : null),
    [api, metadata]
  );

  useEffect(() => {
    if (metadata) {
      setParams(metadata?.constructors[constructorIndex].args as []);
    }
  }, [metadata, constructorIndex]);

  useEffect((): void => {
    let contract: SubmittableExtrinsic<'promise'> | null = null;
    let error: string | null = null;

    try {
      contract =
        code && metadata?.constructors[constructorIndex]?.method && endowment
          ? code.tx[metadata.constructors[constructorIndex].method](
              {
                gasLimit: 155852802980, // gas,
                value: 1300889614901161, // endowment,
              },
              ...extractValues(params)
            )
          : null;
    } catch (e) {
      error = (e as Error).message;
    }

    setUploadTx(() => [contract, error]);
  }, [code, metadata, constructorIndex, endowment, params, gas]);

  if (currentStep !== 3) return null;

  return (
    <CanvasContext.Consumer>
      {({ api, keyring, keyringStatus }) => (
        <>
          <div className="dark:text-gray-300 text-gray-700 dark:bg-elevation-1 bg-white p-8 space-y-7 border dark:border-gray-700 border-gray-200 rounded-md">
            <div>
              <p className="text-sm dark:text-gray-300 text-gray-700 font-semibold mb-2">Account</p>
              <div className="flex w-1/2 items-center dark:bg-elevation-1 bg-gray-50 border dark:border-gray-700 border-gray-200 p-3 rounded-md">
                <div>
                  <Identicon size={38} value={state.fromAddress as string} className="" />
                </div>
                <div className="mx-4">
                  <p className="text-sm dark:text-gray-300 text-gray-700 font-semibold">
                    {state.fromAccountName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {String(state.fromAddress).slice(0, 4) +
                      '...' +
                      String(state.fromAddress).slice(-4)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm">
              <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Name</p>
              <p className="text-gray-500">{state.contractName}</p>
            </div>

            <div className="text-sm">
              <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Endowment</p>
              <p className="text-gray-500">{state.endowment}</p>
            </div>

            <div className="text-sm">
              <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Weight</p>
              <p className="text-gray-500">{state.gas}</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              submitHandler(api, keyring, keyringStatus, dispatch, uploadTx, error, state)
            }
          >
            Upload and Instantiate
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              dispatch({
                type: 'GO_TO',
                payload: { step: currentStep - 1 },
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
