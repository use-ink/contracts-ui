// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CheckIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { Spinner } from './Spinner';
import { TxStatus } from 'types';
import { classes } from 'ui/util';

interface Props {
  status?: TxStatus;
}

export const NotificationIcon = ({ status }: Props) => {
  switch (status) {
    case 'success':
      return <CheckIcon key="success" className="text-green-400 w-12 h-12" />;

    case 'error':
      return <ExclamationCircleIcon key="error" className="text-red-400 w-12 h-12" />;

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
      return <ClockIcon key="queued" className={classes('text-blue-500 w-12 h-12')} />;

    default:
      return null;
  }
};
