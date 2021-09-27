// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useCanvas } from './CanvasContext';
import { Transaction as Tx, TransactionsState } from 'types';
import { Transactions } from 'ui/components/Transactions';

let nextId = 0;

export const TransactionsContext = React.createContext({} as unknown as TransactionsState);

export function TransactionsContextProvider ({ children }: React.PropsWithChildren<Partial<TransactionsState>>) {
  const { keyring } = useCanvas();
  const [txs, setTxs] = useState<Tx[]>([]);

  const queue = useCallback(
    (extrinsic: Tx['extrinsic'], accountId: Tx['accountId'], onSuccess: Tx['onSuccess'], onError: Tx['onError'], isValid: Tx['isValid']): number => {
      setTxs([
        ...txs,
        {
          id: ++nextId,
          accountId,
          extrinsic,
          isComplete: false,
          isProcessing: false,
          isError: false,
          isSuccess: false,
          isValid,
          onSuccess,
          onError,
        }
      ]);

      return nextId;
    },
    [txs]
  )

  const process = useCallback(
    async (id: number) => {
      const tx = txs.find(tx => id === tx.id);

      if (tx) {
        const { extrinsic, accountId, isValid, onSuccess, onError } = tx;

        try {
          setTxs([
            ...txs.map((tx) => {
              return tx.id === id
                ? {
                  ...tx,
                  isProcessing: true
                }
                : tx
            })
          ]);

          const unsub = await extrinsic.signAndSend(
            keyring.getPair(accountId),
            {},
            async (result) => {
              if ((result.isInBlock || result.isFinalized) && isValid(result)) {
                onSuccess && await onSuccess(result);

                setTxs([
                  ...txs.map((tx) => {
                    return tx.id === id
                      ? {
                        ...tx,
                        isComplete: true,
                        isProcessing: false,
                        isSuccess: true
                      }
                      : tx
                  })
                ]);

                unsub();
              }
            }
          )
        } catch (e) {
          console.error(e);
          onError && onError();

          setTxs([
            ...txs.map((tx) => {
              return tx.id === id
                ? {
                  ...tx,
                  isComplete: true,
                  isProcessing: false,
                  isError: true
                }
                : tx
            })
          ]);
        }
      } 
    },
    [txs]
  )

  function unqueue (id: number) {
    setTxs([
      ...txs.filter((tx) => tx.id !== id || (tx.isProcessing || tx.isComplete))
    ]);
  }

  function dismiss (id: number) {
    setTxs([
      ...txs.filter((tx) => tx.id !== id)
    ]);
  }


  useEffect(
    (): () => void => {
      let autoDismiss: NodeJS.Timeout;

      if (txs.length > 0) {
        autoDismiss = setTimeout(
          (): void => {
            setTxs([
              ...txs.filter(({ isComplete }) => !isComplete)
            ])
          },
          5000
        );
      }

      return () => clearTimeout(autoDismiss);
    },
    [txs]
  )

  const state = {
    txs,
    dismiss,
    process,
    queue,
    unqueue,
  }

  return (
    <TransactionsContext.Provider value={state}>
      <Transactions {...state} />
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
