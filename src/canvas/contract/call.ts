import { encodeSalt, transformUserInput } from 'canvas/util';

import { ContractPromise, ContractQuery, ContractTx, ContractCallParams } from 'types';

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
  const transformed = transformUserInput(args, userInput);
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
        console.log('sending transaction...');

        if (status.isFinalized) {
          console.log(`Transaction included at blockHash ${status.asFinalized}`);

          const log = events.map(
            ({
              event: {
                data,
                method,
                meta: { docs },
              },
            }) => {
              return `${method}:: ${data} 
                ${docs.toString()}`;
            }
          );

          const callResult = {
            data: JSON.stringify(log),
            method: method,
            returnType: returnType?.displayName || '',
            time: Date.now(),
          };
          dispatch({
            type: 'CALL_SUCCESS',
            payload: callResult,
          });

          if (dispatchError) {
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            dispatch({ type: 'CALL_ERROR', payload: decoded });
          }
          console.log(dispatchInfo?.toHuman());
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
      if (result.isOk) {
        const callResult = {
          data: output?.toHuman(),
          method: method,
          returnType: returnType?.displayName || '',
          time: Date.now(),
        };

        dispatch({
          type: 'CALL_SUCCESS',
          payload: callResult,
        });
      }
      if (result.isErr) {
        const error = result.asErr;
        if (error.isModule) {
          const decoded = api.registry.findMetaError(error.asModule);
          dispatch({ type: 'CALL_ERROR', payload: decoded });
        } else {
          console.error(`Error calling contract: ${error}`);
        }
      }
    }
  } else {
    console.error('Kering pair not found');
  }
}
