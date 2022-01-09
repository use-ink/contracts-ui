// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useContext, useEffect } from 'react';
import { useApi } from './ApiContext';
import { TxOptions, TransactionsState, TxStatus as Status, TransactionsQueue } from 'types';
import { Transactions } from 'ui/components/Transactions';

let nextId = 1;

export const TransactionsContext = React.createContext({} as unknown as TransactionsState);

export function TransactionsContextProvider({
  children,
}: React.PropsWithChildren<Partial<TransactionsState>>) {
  const { keyring, api } = useApi();
  const [txs, setTxs] = useState<TransactionsQueue>({});

  function queue(options: TxOptions): number {
    setTxs({
      ...txs,
      [nextId]: {
        ...options,

        status: Status.Queued,
        events: {},
      },
    });

    return nextId;
  }
  async function process(id: number) {
    const tx = txs[id];

    if (tx) {
      const { extrinsic, accountId, isValid, onSuccess } = tx;

      setTxs({ ...txs, [id]: { ...txs[id], status: Status.Processing } });

      const unsub = await extrinsic.signAndSend(keyring.getPair(accountId), {}, async result => {
        if (result.isFinalized) {
          const events: Record<string, number> = {};

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
            setTxs({ ...txs, [id]: { ...txs[id], status: Status.Error, events } });

            let message = 'Transaction failed';

            if (result.dispatchError?.isModule) {
              const decoded = api.registry.findMetaError(result.dispatchError.asModule);
              message = `${decoded.section.toUpperCase()}.${decoded.method}: ${decoded.docs}`;
            }
            throw new Error(message);
          }

          onSuccess && (await onSuccess(result));

          setTxs({ ...txs, [id]: { ...txs[id], status: Status.Success, events } });

          unsub();

          nextId++;
        }
      });
    }
  }

  function dismiss(id: number) {
    const newTxs = { ...txs };
    delete newTxs[id];
    setTxs(newTxs);
  }

  useEffect((): (() => void) => {
    let autoDismiss: NodeJS.Timeout;

    if (JSON.stringify(txs) !== '{}') {
      const completed: number[] = [];
      for (const id in txs) {
        if (txs[id].status === 'error' || txs[id].status === 'success') {
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
