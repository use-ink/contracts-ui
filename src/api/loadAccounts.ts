import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { keyring as Keyring } from '@polkadot/ui-keyring';
import { isTestChain } from '@polkadot/util';
import type { ApiAction, ApiState } from 'types';

export const loadAccounts = (state: ApiState, dispatch: React.Dispatch<ApiAction>) => {
  const { systemChainType, systemChain } = state;
  dispatch({ type: 'LOAD_KEYRING' });

  const asyncLoadAccounts = async () => {
    try {
      await web3Enable('contracts-ui');
      let allAccounts = await web3Accounts();

      allAccounts = allAccounts.map(({ address, meta }) => ({
        address,
        meta: { ...meta, name: `${meta.name} (${meta.source})` },
      }));

      const isDevelopment =
        systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain);

      Keyring.loadAll({ isDevelopment }, allAccounts);

      dispatch({ type: 'SET_KEYRING', payload: Keyring });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'KEYRING_ERROR' });
    }
  };
  asyncLoadAccounts().catch(e => console.error(e));
};
