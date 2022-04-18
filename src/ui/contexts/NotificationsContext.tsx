// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useState, useContext, useEffect } from 'react';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useApi } from './ApiContext';
import {
  TxOptions,
  NotificationsState,
  TxStatus as Status,
  NotificationObject,
  NotificationsQueue,
  TransactionsQueue,
} from 'types';
import { Notifications } from 'ui/components/Notifications';
import { isResultReady } from 'api/util';
import { isEmptyObj } from 'ui/util';

let nextId = 1;

export const NotificationsContext = createContext({} as unknown as NotificationsState);

export function NotificationsContextProvider({
  children,
}: React.PropsWithChildren<Partial<NotificationsState>>) {
  const { api, keyring, systemChainType } = useApi();
  const [notifications, setNotifications] = useState<NotificationsQueue>({});
  const [txs, setTxs] = useState<TransactionsQueue>({});

  function notify(value: NotificationObject) {
    setNotifications({
      ...notifications,
      [nextId]: value,
    });

    return ++nextId;
  }

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
      const { extrinsic, accountId, isValid, onSuccess, onError } = tx;

      setTxs({ ...txs, [id]: { ...tx, status: Status.Processing } });

      let injector, accountOrPair;
      try {
        injector = await web3FromAddress(accountId);
        accountOrPair = accountId;
      } catch (e) {
        accountOrPair = keyring.getPair(accountId);
      }

      try {
        const unsub = await extrinsic.signAndSend(
          accountOrPair,
          { signer: injector?.signer || undefined },
          async result => {
            if (isResultReady(result, systemChainType)) {
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
                setTxs({ ...txs, [id]: { ...tx, status: Status.Error, events } });

                let message = 'Transaction failed';

                if (result.dispatchError?.isModule) {
                  const decoded = api.registry.findMetaError(result.dispatchError.asModule);
                  message = `${decoded.section.toUpperCase()}.${decoded.method}: ${decoded.docs}`;
                }

                onError && onError(result);

                throw new Error(message);
              }

              onSuccess && (await onSuccess(result));

              setTxs({ ...txs, [id]: { ...tx, status: Status.Success, events } });

              unsub();

              nextId++;
            }
          }
        );
      } catch (error) {
        setTxs({ ...txs, [id]: { ...tx, status: Status.Error } });
        console.error(error);
      }
    }
  }

  function dismiss(id: number) {
    const newTxs = { ...txs };
    delete newTxs[id];

    const newNotifications = { ...notifications };
    delete newNotifications[id];

    setNotifications(newNotifications);
    setTxs(newTxs);
  }

  useEffect((): (() => void) => {
    let autoDismiss: NodeJS.Timeout;

    const completed: number[] = [];

    for (const id in notifications) {
      completed.push(parseInt(id));
    }

    if (!isEmptyObj(txs)) {
      for (const id in txs) {
        if (txs[id]?.status === 'error' || txs[id]?.status === 'success') {
          completed.push(parseInt(id));
        }
      }
    }

    if (completed.length > 0) {
      autoDismiss = setTimeout((): void => {
        const newTxs = { ...txs };
        const newNotifications = { ...notifications };

        completed.forEach(id => {
          delete newTxs[id];
          delete newNotifications[id];
        });

        setTxs(newTxs);
        setNotifications(newNotifications);
      }, 5000);
    }

    return () => clearTimeout(autoDismiss);
  }, [notifications, txs]);

  const state = {
    notifications,
    txs,
    dismiss,
    notify,
    process,
    queue,
  };

  return (
    <NotificationsContext.Provider value={state}>
      <Notifications {...state} />
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);
