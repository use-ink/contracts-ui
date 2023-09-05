// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CheckIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { Spinner } from '~/shared/loader/spinner';
import { TxStatus } from '~/types';
import { classes } from '~/lib/util';

interface Props {
  status?: TxStatus;
}

export const NotificationIcon = ({ status }: Props) => {
  switch (status) {
    case 'success':
      return <CheckIcon className="w-12 h-12 text-green-400" key="success" />;

    case 'error':
      return <ExclamationCircleIcon className="w-12 h-12 text-red-400" key="error" />;

    case 'processing':
      return (
        <Spinner
          className="m-2 border-blue-500 processing-spinner"
          key="processing"
          strokeWidth={2}
          width={8}
        />
      );

    case 'queued':
      return <ClockIcon className={classes('h-12 w-12 text-blue-500')} key="queued" />;

    default:
      return null;
  }
};
