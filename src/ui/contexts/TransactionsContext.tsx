// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useContext, useEffect } from 'react';
import { useApi } from './ApiContext';
import {
  TransactionOptions,
  Transaction as Tx,
  TransactionsState,
  Transaction,
  TxStatus as Status,
} from 'types';
import { Transactions } from 'ui/components/Transactions';

let nextId = 1;

export function createTx(options: TransactionOptions): Transaction {
  return {
    ...options,
    id: nextId,
    status: Status.Queued,
    events: {},
  };
}

export const TransactionsContext = React.createContext({} as unknown as TransactionsState);

export function TransactionsContextProvider({
  children,
}: React.PropsWithChildren<Partial<TransactionsState>>) {
  const { keyring, api } = useApi();
  const [txs, setTxs] = useState<Tx[]>([]);

  function queue(options: TransactionOptions): number {
    setTxs(txs => [
      ...txs.filter(({ id, status }) => id < nextId && status === 'queued'),
      createTx(options),
    ]);

    return nextId;
  }
  async function process(id: number) {
    const tx = txs.find(tx => id === tx.id);

    if (tx) {
      const { extrinsic, accountId, isValid, onSuccess } = tx;

      setTxs(txs => [
        ...txs.map(tx => {
          return tx.id === id
            ? {
                ...tx,
                status: Status.Processing,
              }
            : tx;
        }),
      ]);

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
            setTxs(txs => [
              ...txs.map(tx => {
                return tx.id === id
                  ? {
                      ...tx,
                      status: Status.Error,
                      events,
                    }
                  : tx;
              }),
            ]);

            let message = 'Transaction failed';

            if (result.dispatchError?.isModule) {
              const decoded = api.registry.findMetaError(result.dispatchError.asModule);
              message = `${decoded.section.toUpperCase()}.${decoded.method}: ${decoded.docs}`;
            }
            throw new Error(message);
          }

          onSuccess && (await onSuccess(result));

          setTxs(txs => [
            ...txs.map(tx => {
              return tx.id === id
                ? {
                    ...tx,
                    status: Status.Success,
                    events,
                  }
                : tx;
            }),
          ]);

          unsub();

          nextId++;
        }
      });
    }
  }

  function unqueue(id: number) {
    setTxs([...txs.filter(tx => tx.id !== id || tx.status !== 'queued')]);
  }

  function dismiss(id: number) {
    setTxs([...txs.filter(tx => tx.id !== id)]);
  }

  useEffect((): (() => void) => {
    let autoDismiss: NodeJS.Timeout;

    if (txs.length > 0) {
      const completed = txs.filter(({ status }) => status === 'error' || status === 'success');
      if (completed.length > 0) {
        autoDismiss = setTimeout((): void => {
          setTxs([...txs.filter(({ status }) => status === 'processing' || status === 'queued')]);
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
    unqueue,
  };

  return (
    <TransactionsContext.Provider value={state}>
      <Transactions {...state} />
      {children}
    </TransactionsContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionsContext);
