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
      return <CheckIcon className="text-green-400 w-12 h-12" key="success" />;

    case 'error':
      return <ExclamationCircleIcon className="text-red-400 w-12 h-12" key="error" />;

    case 'processing':
      return (
        <Spinner
          className="processing-spinner m-2 border-blue-500"
          key="processing"
          strokeWidth={2}
          width={8}
        />
      );

    case 'queued':
      return <ClockIcon className={classes('text-blue-500 w-12 h-12')} key="queued" />;

    default:
      return null;
  }
};
