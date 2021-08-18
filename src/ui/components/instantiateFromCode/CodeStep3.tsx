import React, { useMemo, useEffect, useState } from 'react';
import { CodePromise } from '@polkadot/api-contract';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { CodecArg } from '@polkadot/types/types';
import { ApiPromise, Keyring, InstantiateState, InstantiateCodeAction, RawParam } from 'types';
import { CanvasContext } from 'ui/contexts';
import { withEllipsis } from 'canvas/util';

interface Props {
  state: InstantiateState;
  dispatch: React.Dispatch<InstantiateCodeAction>;
  api: ApiPromise;
  currentStep: number;
  submitHandler: (
    api: ApiPromise | null,
    keyring: Keyring | null,
    keyringState: string | null,
    dispatch: (action: InstantiateCodeAction) => void,
    uploadTx: SubmittableExtrinsic<'promise'> | null,
    error: string | null,
    { fromAddress, metadata }: InstantiateState
  ) => void;
}

function extractValues(values: RawParam[]): CodecArg[] {
  return values.map(({ value }) => value as CodecArg);
}

export const CodeStep3 = ({ state, dispatch, api, currentStep, submitHandler }: Props) => {
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

  if (currentStep !== 4) return null;

  return (
    <CanvasContext.Consumer>
      {({ api, keyring, keyringStatus }) => (
        <>
          <div className="dark:text-gray-300 text-gray-700 dark:bg-elevation-1 bg-white p-8 space-y-7 border dark:border-gray-700 border-gray-200 rounded-md">
            <div>
              <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Account</p>
              <div className="flex w-1/2 items-center dark:bg-elevation-1 bg-gray-50 border dark:border-gray-700 border-gray-200 p-3 rounded-md">
                <div>
                  <svg
                    className="w-14 h-14"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d)">
                      <mask
                        id="mask0"
                        mask-type="alpha"
                        maskUnits="userSpaceOnUse"
                        x="2"
                        y="1"
                        width="32"
                        height="32"
                      >
                        <circle cx="18" cy="17" r="16" fill="#31383D" />
                      </mask>
                      <g mask="url(#mask0)">
                        <rect x="2" y="1" width="8" height="8" fill="#9B4066" />
                        <rect x="10" y="1" width="8" height="8" fill="#3C3D47" />
                        <rect x="18" y="1" width="8" height="8" fill="#3C3D47" />
                        <rect x="26" y="1" width="8" height="8" fill="#9B4066" />
                        <rect x="2" y="9" width="8" height="8" fill="#3C3D47" />
                        <rect x="10" y="9" width="8" height="8" fill="#3F3E6D" />
                        <rect x="18" y="9" width="8" height="8" fill="#9B4066" />
                        <rect x="26" y="9" width="8" height="8" fill="#3C3D47" />
                        <rect x="2" y="17" width="8" height="8" fill="#3C3D47" />
                        <rect x="10" y="17" width="8" height="8" fill="#9B4066" />
                        <rect x="18" y="17" width="8" height="8" fill="#3F3E6D" />
                        <rect x="26" y="17" width="8" height="8" fill="#3C3D47" />
                        <rect x="2" y="25" width="8" height="8" fill="#9B4066" />
                        <rect x="10" y="25" width="8" height="8" fill="#3C3D47" />
                        <rect x="18" y="25" width="8" height="8" fill="#3C3D47" />
                        <rect x="26" y="25" width="8" height="8" fill="#9B4066" />
                      </g>
                    </g>
                    <defs>
                      <filter
                        id="filter0_d"
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="1" />
                        <feGaussianBlur stdDeviation="1" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                </div>

                <div className="mx-4">
                  <p className="dark:text-gray-300 text-gray-700 font-semibold">
                    {state.fromAccountName}
                  </p>
                  <p className="text-gray-500">{withEllipsis(state.fromAddress || '')}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Name</p>
              <p className="text-gray-500">{state.contractName}</p>
            </div>

            <div>
              <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Endowment</p>
              <p className="text-gray-500">{state.endowment}</p>
            </div>

            <div>
              <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Weight</p>
              <p className="text-gray-500">{state.gas}</p>
            </div>
          </div>

          <button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-600 mr-4 text-gray-100 font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              submitHandler(api, keyring, keyringStatus, dispatch, uploadTx, error, state)
            }
          >
            Upload and Instantiate
          </button>
          <button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-600 text-gray-100 font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              dispatch({
                type: 'GO_TO',
                payload: { step: 2 },
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
