// Copyright 2022-2024 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AddressOrPair } from '@polkadot/api/types';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { keyring } from '@polkadot/ui-keyring';
import { createContext, useContext, useEffect, useState } from 'react';
import { useApi } from './ApiContext';
import { isEmptyObj } from 'lib/util';
import { TransactionsQueue, TransactionsState, TxOptions, TxStatusMap } from 'types';
import { Transactions } from 'ui/components/Transactions';

let nextId = 1;

export const TransactionsContext = createContext({} as unknown as TransactionsState);

export function TransactionsContextProvider({
  children,
}: React.PropsWithChildren<Partial<TransactionsState>>) {
  const { api } = useApi();
  const [txs, setTxs] = useState<TransactionsQueue>({});

  function queue(options: TxOptions): number {
    setTxs({
      ...txs,
      [nextId]: {
        ...options,
        status: TxStatusMap.Queued,
        events: {},
      },
    });

    return nextId;
  }

  async function process(id: number) {
    const tx = txs[id];
    if (!tx) throw new Error(`No tx with id: ${id} is queued `);

    const { extrinsic, accountId, isValid, onSuccess, onError } = tx;
    setTxs({ ...txs, [id]: { ...tx, status: TxStatusMap.Processing } });

    const keyPair = keyring.getPair(accountId);
    let addressOrPair: AddressOrPair = keyPair;
    let signer = undefined;

    // If the account is not a testing account (//Alice etc.),
    // we need the `signer` from the extension
    if (!keyPair.meta.isTesting) {
      signer = (await web3FromAddress(accountId)).signer;
      // Only use plain address, otherwise pjs api want to sign with given KeyPair
      // instead of `signer`
      addressOrPair = keyPair.address;
    }

    try {
      const unsubscribe = await extrinsic.signAndSend(addressOrPair, { signer }, async result => {
        if (result.isInBlock || result.isFinalized) {
          const events: Record<string, number> = {};

          // Count events
          result.events.forEach(record => {
            const { event } = record;
            const key = `${event.section}:${event.method}`;
            if (!events[key]) {
              events[key] = 1;
            } else {
              events[key]++;
            }
          });

          if (!isValid(result)) {
            setTxs({ ...txs, [id]: { ...tx, status: TxStatusMap.Error, events } });

            let message = 'Transaction failed';

            if (result.dispatchError?.isModule) {
              const decoded = api?.registry.findMetaError(result.dispatchError.asModule);
              message = `${decoded?.section.toUpperCase()}.${decoded?.method}: ${decoded?.docs}`;
            }

            onError && onError(result);

            unsubscribe();
            throw new Error(message);
          } else {
            onSuccess && (await onSuccess(result));

            setTxs({ ...txs, [id]: { ...tx, status: TxStatusMap.Success, events } });

            unsubscribe();

            nextId++;
          }
        }
      });
    } catch (error) {
      setTxs({ ...txs, [id]: { ...tx, status: TxStatusMap.Error } });
      console.error(error);
    }
  }

  function dismiss(id: number) {
    const newTxs = { ...txs };
    delete newTxs[id];
    setTxs(newTxs);
  }

  useEffect((): (() => void) => {
    let autoDismiss: NodeJS.Timeout;

    if (!isEmptyObj(txs)) {
      const completed: number[] = [];
      for (const id in txs) {
        if (txs[id]?.status === 'error' || txs[id]?.status === 'success') {
          completed.push(parseInt(id));
        }
      }
      if (completed.length > 0) {
        autoDismiss = setTimeout((): void => {
          const newTxs = { ...txs };
          completed.forEach(id => delete newTxs[id]);
          setTxs(newTxs);
        }, 5000);
      }
    }

    return () => clearTimeout(autoDismiss);
  }, [txs]);

  const state = {
    txs,
    dismiss,
    process,
    queue,
  };

  return (
    <TransactionsContext.Provider value={state}>
      <Transactions {...state} />
      {children}
    </TransactionsContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionsContext);
