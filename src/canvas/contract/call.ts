import { encodeSalt } from '../util';
import {
  ContractPromise,
  ContractQuery,
  ContractTx,
  SubmittableExtrinsic,
  ISubmittableResult,
  ContractCallParams,
} from 'types';

export function prepareContractTx(
  tx: ContractTx<'promise'>,
  options: { gasLimit: number; salt: Uint8Array; value: number },
  args?: string[]
) {
  return args ? tx(options, ...args) : tx(options);
}
export async function executeTx(
  tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
  fromAddress: string
): Promise<ISubmittableResult | null> {
  let txResult: ISubmittableResult | null = null;
  try {
    await tx.signAndSend(fromAddress, result => {
      txResult = result;
    });
  } catch (error) {
    console.error('error sending transaction: ', error);
  }

  return txResult;
}
export function sendContractQuery(
  options: { endowment: number; gasLimit: number },
  fromAddress: string,
  query: ContractQuery<'promise'>,
  args?: string[]
) {
  return args ? query(fromAddress, options, ...args) : query(fromAddress, options);
}

export async function call({
  api,
  abi,
  contractAddress,
  message,
  endowment,
  gasLimit,
  fromAddress,
  argValues,
}: ContractCallParams) {
  const expectsArgs = message.args.length > 0;

  const args = expectsArgs ? (argValues ? Object.values(argValues) : []) : undefined;

  const contract = new ContractPromise(api, abi, contractAddress);
  const salt = encodeSalt();

  if (message.isMutating || message.isPayable) {
    const tx = prepareContractTx(
      contract.tx[message.identifier],
      { gasLimit, value: endowment, salt },
      args
    );
    const res = executeTx(tx, fromAddress);
    console.log(res);
  } else {
    const { result, gasConsumed } = await sendContractQuery(
      { gasLimit, endowment },
      fromAddress,
      contract.query[message.identifier],
      args
    );
    console.log(result, gasConsumed);
  }
}
