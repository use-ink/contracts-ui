import { encodeSalt, formatData } from 'canvas/util';
import {
  ContractPromise,
  ContractQuery,
  ContractTx,
  SubmittableExtrinsic,
  ISubmittableResult,
  ContractCallParams,
  KeyringPair,
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
  pair: KeyringPair
): Promise<ISubmittableResult | null> {
  let txResult: ISubmittableResult | null = null;
  try {
    await tx.signAndSend(pair, result => {
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
  keyringPair,
  argValues,
}: ContractCallParams) {
  const expectsArgs = message.args.length > 0;
  const args = expectsArgs ? (argValues ? Object.values(argValues) : []) : undefined;
  const contract = new ContractPromise(api, abi, contractAddress);
  const salt = encodeSalt();

  if (keyringPair) {
    if (message.isMutating || message.isPayable) {
      const tx = prepareContractTx(
        contract.tx[message.method],
        { gasLimit, value: endowment, salt },
        args
      );
      const res = executeTx(tx, keyringPair);
      console.log(res);
    } else {
      const { result } = await sendContractQuery(
        { gasLimit, endowment },
        keyringPair.address,
        contract.query[message.method],
        args
      );
      if (message.returnType && result.isOk) {
        const output = formatData(api.registry, result.asOk.data, message.returnType);
        console.log(output);
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
