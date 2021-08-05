import { encodeSalt } from '../util';
import { ContractPromise, ApiPromise, AbiMessage, Abi } from 'types';

export function createContractTx(
  contract: ContractPromise | null,
  options: { gasLimit: number; salt: Uint8Array; value: number },
  message: AbiMessage,
  args: string[]
) {
  return message.args.length > 0
    ? contract?.tx[message.index](options, ...args)
    : contract?.tx[message.index](options);
}

export function createContractQuery(
  contract: ContractPromise,
  message: AbiMessage,
  args: string[],
  endowment: number,
  gasLimit: number,
  fromAddress: string
) {
  return message.args.length > 0
    ? contract.query[message.identifier](fromAddress, { value: endowment, gasLimit }, ...args)
    : contract.query[message.identifier](fromAddress, { value: endowment, gasLimit });
}

export async function call(
  api: ApiPromise,
  abi: Abi,
  address: string,
  endowment: number,
  gasLimit: number,
  message: AbiMessage,
  fromAddress: string,
  argValues?: Record<string, string>
) {
  const args = argValues ? Object.values(argValues) : [];
  const contract = new ContractPromise(api, abi, address);
  const salt = encodeSalt();
  if (message.isPayable) {
    const transaction = createContractTx(
      contract,
      { value: endowment, salt, gasLimit },
      message,
      args
    );
    transaction
      ?.signAndSend(fromAddress, result => {
        if (result.status.isInBlock) {
          console.log('in a block');
        } else if (result.status.isFinalized) {
          console.log('finalized');
        }
        if (result.dispatchError) {
          console.log(result.dispatchError);
        }
      })
      .catch(e => console.log('error sending transaction: ', e));
  } else {
    const query = createContractQuery(contract, message, args, endowment, gasLimit, fromAddress);

    const { gasConsumed, result } = await query;
    console.log('gas consumed', gasConsumed);
    console.log('result', result);
  }
}
