// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from './Spinner';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  message?: React.ReactNode;
}

export function Loader({ children, isLoading, message }: Props): React.ReactElement {
  const { t } = useTranslation();

  return isLoading ? (
    <div className="text-lg my-32 font-bolder w-full h-full max-w-5xl flex flex-col items-center">
      <Spinner className="mb-3" />
      <div>{message || `${t('loading', 'Loading')}...`}</div>
    </div>
  ) : (
    <>{children}</>
  );
}
