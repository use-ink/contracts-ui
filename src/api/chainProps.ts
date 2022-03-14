import { TypeRegistry } from '@polkadot/types/create';
import { DEFAULT_DECIMALS } from '../constants';
import { blockTimeMs } from 'api/util/blockTime';
import { ChainProperties, ApiPromise } from 'types';

const registry = new TypeRegistry();

async function getChainProperties(api: ApiPromise): Promise<ChainProperties | null> {
  const blockNumber = (await api.rpc.chain.getHeader()).number.toNumber();

  if (blockNumber > 1) {
    const [chainProperties, blockOneHash, systemName, systemVersion, systemChain, systemChainType] =
      await Promise.all([
        api.rpc.system.properties(),
        api.query.system.blockHash(1),
        api.rpc.system.name(),
        api.rpc.system.version(),
        (await api.rpc.system.chain()).toString(),
        api.rpc.system.chainType
          ? api.rpc.system.chainType()
          : Promise.resolve(registry.createType('ChainType', 'Live')),
        api.rpc.system,
      ]);

    const result = {
      blockOneHash: blockOneHash.toString(),
      systemName: systemName.toString(),
      systemVersion: systemVersion.toString(),
      systemChainType,
      systemChain,
      tokenDecimals: chainProperties.tokenDecimals.isSome
        ? chainProperties.tokenDecimals.unwrap().toArray()[0].toNumber()
        : DEFAULT_DECIMALS,
      tokenSymbol: chainProperties.tokenSymbol.isSome
        ? chainProperties.tokenSymbol
            .unwrap()
            .toArray()
            .map(s => s.toString())[0]
        : 'Unit',
    };

    return result;
  }

  return null;
}

export async function getChainPropertiesWhenReady(api: ApiPromise) {
  let chainProperties = await getChainProperties(api);

  if (!chainProperties) {
    chainProperties = await new Promise(resolve => {
      const interval = setInterval(() => {
        getChainProperties(api)
          .then(result => {
            if (result) {
              clearInterval(interval);
              resolve(result);
            }
          })
          .catch(console.error);
      }, blockTimeMs(api).toNumber());
    });
  }

  return chainProperties;
}
