import { encodeSalt, transformUserInput } from 'canvas/util';

import {
  ContractPromise,
  ContractQuery,
  ContractTx,
  ContractCallParams,
  CallResult,
  RegistryError,
} from 'types';

export function prepareContractTx(
  tx: ContractTx<'promise'>,
  options: { gasLimit: number; salt: Uint8Array; value: number },
  args: unknown[]
) {
  return args.length > 0 ? tx(options, ...args) : tx(options);
}

export function sendContractQuery(
  options: { endowment: number; gasLimit: number },
  fromAddress: string,
  query: ContractQuery<'promise'>,
  args: unknown[]
) {
  return args?.length > 0 ? query(fromAddress, options, ...args) : query(fromAddress, options);
}

export async function call({
  api,
  abi,
  contractAddress,
  message: { args, isMutating, isPayable, method, returnType },
  endowment,
  gasLimit,
  keyringPair,
  argValues,
  dispatch,
}: ContractCallParams) {
  const userInput = argValues ? Object.values(argValues) : [];
  const contract = new ContractPromise(api, abi, contractAddress);
  const salt = encodeSalt();
  const transformed = transformUserInput(args, userInput as string[]);

  const callResult: CallResult = {
    data: '',
    log: [],
    method: method,
    returnType: returnType?.displayName || returnType?.type || '',
    time: Date.now(),
    isMutating: isMutating ? true : false,
    isPayable: isPayable ? true : false,
  };

  if (keyringPair) {
    dispatch({ type: 'CALL_INIT' });
    if (isMutating || isPayable) {
      const tx = prepareContractTx(
        contract.tx[method],
        { gasLimit, value: endowment, salt },
        transformed
      );

      const unsub = await tx.signAndSend(keyringPair, result => {
        const { status, events, dispatchError, dispatchInfo } = result;

        const log = events.map(({ event }) => {
          return `${event.section}:${event.method}`;
        });

        let error: RegistryError | undefined;

        if (status.isFinalized) {
          if (dispatchError) {
            error = api.registry.findMetaError(dispatchError.asModule);
          }

          dispatch({
            type: 'CALL_FINALISED',
            payload: {
              ...callResult,
              log: log,
              error,
              blockHash: status.asFinalized.toString(),
              info: dispatchInfo?.toHuman(),
            },
          });

          unsub();
        }
      });
    } else {
      const { result, output } = await sendContractQuery(
        { gasLimit, endowment },
        keyringPair.address,
        contract.query[method],
        transformed
      );

      let error: RegistryError | undefined;

      if (result.isErr && result.asErr.isModule) {
        error = api.registry.findMetaError(result.asErr.asModule);
      }

      dispatch({
        type: 'CALL_FINALISED',
        payload: { ...callResult, data: output?.toHuman(), error },
      });
    }
  } else {
    console.error('Kering pair not found');
  }
}
