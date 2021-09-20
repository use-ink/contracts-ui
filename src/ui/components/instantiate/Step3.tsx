import React from 'react';
import { Identicon } from '@polkadot/react-identicon';
import { useCanvas, useDatabase, useInstantiate } from 'ui/contexts';
import { instantiate } from 'canvas';
// import keyring from '@polkadot/ui-keyring';

export const Step3 = () => {
  const canvasState = useCanvas();
  const dbState = useDatabase();
  const instantiateState = useInstantiate();

  const { accountId, codeHash, endowment, weight, name, step: [step, setStep] } = instantiateState;

  // const account = accountId && keyring.getAccount(accountId);
  // const { endowment, metadata, gas, file } = state;
  // const [params, setParams] = useState<unknown[]>([]);
  // const [[uploadTx, error], setUploadTx] = useState<
  //   [SubmittableExtrinsic<'promise'> | null, string | null]
  // >([null, null]);

  // const code = useMemo(
  //   () => (api && metadata ? new CodePromise(api, metadata.value, file?.data) : null),
  //   [api, metadata]
  // );

  // console.log('Step 3 - params: ', metadata.value?.constructors[constructorIndex].args);

  // useEffect(() => {
  //   if (metadata) {
  //     setParams(metadata.value?.constructors[constructorIndex].args as []);
  //   }
  // }, [metadata, constructorIndex]);

  // useEffect((): void => {
  //   let contract: SubmittableExtrinsic<'promise'> | null = null;
  //   let error: string | null = null;

  //   try {
  //     contract =
  //       code && metadata.value?.constructors[constructorIndex]?.method && endowment
  //         ? code.tx[metadata.value.constructors[constructorIndex].method](
  //             { gasLimit: weight.megaGas, value: endowment },
  //             ...params
  //           )
  //         : null;
  //   } catch (e) {
  //     error = (e as Error).message;
  //   }

  //   setUploadTx(() => [contract, error]);
  // }, [code, metadata, constructorIndex, params, endowment, weight.megaGas]);

  function goBack () {
    setStep(step - 1);
  }

  return (
    <>
      <div className="dark:text-gray-300 text-gray-700 dark:bg-elevation-1 bg-white p-8 space-y-7 border dark:border-gray-700 border-gray-200 rounded-md">
        <div>
          <p className="text-sm dark:text-gray-300 text-gray-700 font-semibold mb-2">Account</p>
          <div className="flex w-1/2 items-center dark:bg-elevation-1 bg-gray-50 border dark:border-gray-700 border-gray-200 p-3 rounded-md">
            <div>
              <Identicon size={38} value={accountId[0]} />
            </div>
            <div className="mx-4">
              <p className="text-sm dark:text-gray-300 text-gray-700 font-semibold">
                {canvasState.keyring!.getAccount(accountId[0]!)?.meta.name}
              </p>
              <p className="text-xs text-gray-500">
                {String(accountId).slice(0, 4) +
                  '...' +
                  String(accountId).slice(-4)}
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm">
          <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Name</p>
          <p className="text-gray-500">{name[0]}</p>
        </div>

        <div className="text-sm">
          <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Endowment</p>
          <p className="text-gray-500">{endowment[0].toString()}</p>
        </div>

        <div className="text-sm">
          <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Weight</p>
          <p className="text-gray-500">{weight.weight.toString()}</p>
        </div>

        <div className="text-sm">
          <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Code Hash</p>
          <p className="text-gray-500">
            {String(codeHash).slice(0, 6) + '...' + String(codeHash).slice(-6)}
          </p>
        </div>
      </div>
      <button
        type="button"
        className="btn-primary"
        onClick={() =>
          instantiate(canvasState, dbState, instantiateState, () => {})
        }
      >
        Upload and Instantiate
      </button>

      <button
        type="button"
        className="btn-secondary"
        onClick={goBack}
      >
        Go Back
      </button>
    </>
  );
};
