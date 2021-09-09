import { encodeSalt, handleDispatchError, transformUserInput } from 'canvas/util';
import {
  ContractPromise,
  ContractQuery,
  ContractTx,
  SubmittableExtrinsic,
  ISubmittableResult,
  ContractCallParams,
  KeyringPair,
  ApiPromise,
} from 'types';

export function prepareContractTx(
  tx: ContractTx<'promise'>,
  options: { gasLimit: number; salt: Uint8Array; value: number },
  args: unknown[]
) {
  return args.length > 0 ? tx(options, ...args) : tx(options);
}

export async function executeTx(
  api: ApiPromise,
  tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
  pair: KeyringPair
) {
  const unsub = await tx.signAndSend(pair, result => {
    const { status, events, dispatchError, dispatchInfo } = result;
    console.log('sending transaction...');

    if (status.isFinalized) {
      console.log(`Transaction included at blockHash ${status.asFinalized}`);

      events.forEach(
        ({
          phase,
          event: {
            data,
            method,
            section,
            meta: { docs },
          },
        }) => {
          console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
          console.log(`\t\t${docs.toString()}`);
        }
      );
      if (dispatchError) {
        handleDispatchError(dispatchError, api);
      }
      console.log(dispatchInfo?.toHuman());

      unsub();
    }
  });
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
  message: { args, isMutating, isPayable, method },
  endowment,
  gasLimit,
  keyringPair,
  argValues,
}: ContractCallParams) {
  const userInput = argValues ? Object.values(argValues) : [];
  const contract = new ContractPromise(api, abi, contractAddress);
  const salt = encodeSalt();
  const transformed = transformUserInput(args, userInput);
  if (keyringPair) {
    if (isMutating || isPayable) {
      const tx = prepareContractTx(
        contract.tx[method],
        { gasLimit, value: endowment, salt },
        transformed
      );

      await executeTx(api, tx, keyringPair);
    } else {
      const { result, output } = await sendContractQuery(
        { gasLimit, endowment },
        keyringPair.address,
        contract.query[method],
        transformed
      );
      if (result.isOk) {
        console.log(output?.toHuman());
      }
      if (result.isErr) {
        const error = result.asErr;
        if (error.isModule) {
          const decoded = api.registry.findMetaError(error.asModule);
          console.error('Error calling contract: ', decoded);
        } else {
          console.error(`Error calling contract: ${error}`);
        }
      }
    }
  } else {
    console.error('Kering pair not found');
  }
}
