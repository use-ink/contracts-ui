import { encodeSalt } from '../util';
import { ContractPromise, KeyringPair, AbiMessage } from 'types';

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
  keyringPair: KeyringPair
) {
  return message.args.length > 0
    ? contract.query[message.identifier](
        keyringPair.address,
        { value: endowment, gasLimit },
        ...args
      )
    : contract.query[message.identifier](keyringPair.address, { value: endowment, gasLimit });
}

export async function call(
  contract: ContractPromise,
  endowment: number,
  gasLimit: number,
  message: AbiMessage,
  argValues?: Record<string, string>,
  keyringPair?: KeyringPair
) {
  const args = argValues ? Object.values(argValues) : [];

  if (keyringPair) {
    const salt = encodeSalt();
    if (message.isPayable) {
      const transaction = createContractTx(
        contract,
        { value: endowment, salt, gasLimit },
        message,
        args
      );
      transaction
        ?.signAndSend(keyringPair, result => {
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
      const query = createContractQuery(contract, message, args, endowment, gasLimit, keyringPair);

      const { gasConsumed, result } = await query;
      console.log('gas consumed', gasConsumed);
      console.log('result', result);
    }
  }
}
