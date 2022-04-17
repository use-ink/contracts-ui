// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BellIcon, XIcon } from '@heroicons/react/outline';
import { NotificationIcon } from './common/NotificationIcon';
import type {
  QueuedTxOptions,
  NotificationsState,
  Notification as NotificationObject,
  VoidFn,
} from 'types';
import { classes, isEmptyObj, truncate } from 'ui/util';

interface NotificationProps {
  dataCy?: string;
  icon: React.ReactNode;
  isDismissable?: boolean;
  label?: React.ReactNode;
  onDismiss: VoidFn;
  text?: React.ReactNode;
}

function notificationText(type: NotificationObject['type']) {
  switch (type) {
    case 'copied':
      return 'Copied to clipboard';

    default:
      return null;
  }
}

function Notification({ dataCy, icon, isDismissable, label, onDismiss, text }: NotificationProps) {
  return (
    <div
      data-cy={dataCy}
      className="max-w-full dark:bg-elevation-3 dark:text-white bg-gray-200 text-gray-600 p-3 mb-3 flex items-center"
    >
      {icon}
      <div className="pl-2 flex-grow text-sm">
        <div>{label}</div>
        {text && <div className="text-gray-400">{text}</div>}
      </div>
      {isDismissable && (
        <XIcon className="text-gray-400 w-4 h-4 cursor-pointer" onClick={onDismiss} />
      )}
    </div>
  );
}

export function Notifications({
  dismiss,
  notifications,
  txs,
}: React.HTMLAttributes<HTMLDivElement> & NotificationsState) {
  return (
    <div className={classes('z-10 fixed right-3 top-3 w-80 last:mb-0')}>
      {Object.entries(notifications).map(([id, { type, value }]: [string, NotificationObject]) => {
        return (
          <Notification
            dataCy="notification"
            icon={<NotificationIcon type={type} />}
            isDismissable
            key={`notification-${id}`}
            label={truncate(value as string, 10)}
            onDismiss={() => dismiss(parseInt(id))}
            text={notificationText(type)}
          />
        );
      })}

      {Object.entries(txs).map(([id, tx]: [string, QueuedTxOptions | undefined]) => {
        const { status, events, extrinsic } = tx || {};
        const isComplete = status === 'error' || status === 'success';

        return (
          <>
            <Notification
              dataCy="transaction-queued"
              icon={<NotificationIcon type={status} />}
              isDismissable={isComplete}
              key={`transaction-${id}`}
              label={extrinsic?.registry.findMetaCall(extrinsic.callIndex).method}
              onDismiss={() => dismiss(parseInt(id))}
              text={status}
            />
            {isComplete && events && !isEmptyObj(events) && (
              <Notification
                dataCy="transaction-complete"
                icon={<BellIcon className="text-yellow-400 w-12 h-12" />}
                isDismissable
                key={`transaction-complete-${id}`}
                label={Object.keys(events).map(eventName => {
                  const times = events[eventName] > 1 ? ` (x${events[eventName]})` : '';
                  return (
                    <div key={eventName} className="dark:text-gray-400">
                      {`${eventName}${times}`}
                    </div>
                  );
                })}
                onDismiss={() => dismiss(parseInt(id))}
              />
            )}
          </>
        );
      })}
    </div>
  );
}
