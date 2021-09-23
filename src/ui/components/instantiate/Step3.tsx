import React from 'react';
import { useCanvas, useDatabase, useInstantiate } from 'ui/contexts';
import { instantiate } from 'canvas';
import { Account } from '../Account';
import { formatBalance } from '@polkadot/util';
// import keyring from '@polkadot/ui-keyring';

function truncate (value: string | undefined): string {
  return value ? `${value.substring(0, 6)}...${value.substring(value.length - 6)}` : '';
}

export const Step3 = () => {
  const canvasState = useCanvas();
  const dbState = useDatabase();
  const instantiateState = useInstantiate();

  const {
    accountId,
    codeHash,
    data,
    endowment,
    metadata,
    weight,
    name,
    step: [, , stepBack]
  } = instantiateState;

  const displayHash = codeHash || metadata.value?.project.source.wasmHash.toHex() || null;

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

  return (
    <>
      <div className="flex flex-wrap dark:text-gray-300 text-gray-700 dark:bg-elevation-1 bg-white p-8 space-y-7 border dark:border-gray-700 border-gray-200 rounded-md">
        <div className='w-full'>
          <p className="text-sm dark:text-gray-300 text-gray-700 font-semibold mb-2">Account</p>
          <div className="flex w-1/2 dark:bg-elevation-1 bg-gray-50 border dark:border-gray-700 border-gray-200 p-3 rounded-md">
            <Account className="p-0" value={accountId.value} />
          </div>
        </div>

        <div className="w-full text-sm">
          <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Name</p>
          <p className="text-gray-500">{name.value}</p>
        </div>

        <div className="w-1/2 text-sm">
          <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Endowment</p>
          <p className="text-gray-500">
            {formatBalance(endowment?.value || undefined, { forceUnit: '-' })}
          </p>
        </div>

        <div className="w-1/2 text-sm">
          <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Weight</p>
          <p className="text-gray-500">
            {weight.weight.toString()}
          </p>
        </div>

        {
          displayHash && (
            <div className="w-1/2 text-sm">
              <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Code Hash</p>
              <p className="text-gray-500">
                {truncate(displayHash)}
              </p>
            </div>
          )
        }

        {data && (
          <div className="w-1/2 text-sm">
            <p className="dark:text-gray-300 text-gray-700 font-semibold mb-2">Data</p>
            <p className="text-gray-500">
              {data.toString()}
            </p>
          </div>
        )}
      </div>
      <button
        type="button"
        className="btn-primary"
        onClick={() =>
          instantiate(canvasState, dbState, instantiateState)
        }
      >
        Upload and Instantiate
      </button>

      <button
        type="button"
        className="btn-secondary"
        onClick={stepBack}
      >
        Go Back
      </button>
    </>
  );
};
