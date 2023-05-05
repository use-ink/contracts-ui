// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CheckIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { Spinner } from './Spinner';
import { TxStatus } from 'types';
import { classes } from 'helpers';

interface Props {
  status?: TxStatus;
}

export const NotificationIcon = ({ status }: Props) => {
  switch (status) {
    case 'success':
      return <CheckIcon key="success" className="h-12 w-12 text-green-400" />;

    case 'error':
      return <ExclamationCircleIcon key="error" className="h-12 w-12 text-red-400" />;

    case 'processing':
      return (
        <Spinner
          key="processing"
          width={8}
          strokeWidth={2}
          className="processing-spinner m-2 border-blue-500"
        />
      );

    case 'queued':
      return <ClockIcon key="queued" className={classes('h-12 w-12 text-blue-500')} />;

    default:
      return null;
  }
};
