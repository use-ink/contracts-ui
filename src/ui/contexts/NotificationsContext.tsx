// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useState, useContext, useEffect } from 'react';
import { NotificationsState, NotificationObject, NotificationsQueue } from 'types';

let nextId = 1;

export const NotificationsContext = createContext({} as unknown as NotificationsState);

export function NotificationsContextProvider({
  children,
}: React.PropsWithChildren<Partial<NotificationsState>>) {
  const [notifications, setNotifications] = useState<NotificationsQueue>({});

  function notify(value: NotificationObject) {
    setNotifications({
      ...notifications,
      [nextId]: value,
    });

    return ++nextId;
  }

  function dismiss(id: number) {
    const newNotifications = { ...notifications };
    delete newNotifications[id];

    setNotifications(newNotifications);
  }

  useEffect((): (() => void) => {
    let autoDismiss: NodeJS.Timeout;

    const completed: number[] = [];

    for (const id in notifications) {
      completed.push(parseInt(id));
    }

    if (completed.length > 0) {
      autoDismiss = setTimeout((): void => {
        const newNotifications = { ...notifications };

        completed.forEach(id => {
          delete newNotifications[id];
        });

        setNotifications(newNotifications);
      }, 5000);
    }

    return () => clearTimeout(autoDismiss);
  }, [notifications]);

  const state = {
    notifications,
    dismiss,
    notify,
  };

  return <NotificationsContext.Provider value={state}>{children}</NotificationsContext.Provider>;
}

export const useNotifications = () => useContext(NotificationsContext);
