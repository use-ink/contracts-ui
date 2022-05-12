// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Notification, NotificationIcon } from './common';
import type { NotificationObject } from 'types';
import { truncate } from 'ui/util';
import { useNotifications } from 'ui/contexts';

function notificationText(type: NotificationObject['type']) {
  switch (type) {
    case 'copied':
      return 'Copied to clipboard';

    default:
      return null;
  }
}

export function Notifications() {
  const { dismiss, notifications } = useNotifications();

  return (
    <>
      {Object.entries(notifications).map(([id, { type, value }]: [string, NotificationObject]) => {
        return (
          <Notification
            data-cy="notification"
            icon={<NotificationIcon type={type} />}
            isDismissable
            key={`notification-${id}`}
            label={truncate(value as string, 10)}
            onDismiss={() => dismiss(parseInt(id))}
            text={notificationText(type)}
          />
        );
      })}
    </>
  );
}
