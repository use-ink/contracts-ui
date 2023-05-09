// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Spinner } from './Spinner';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  message?: React.ReactNode;
}

export function Loader({ children, isLoading, message = 'Loading...' }: Props): React.ReactElement {
  return isLoading ? (
    <div className="text-lg my-32 font-bolder w-full grid place-content-center justify-items-center text-gray-500">
      <Spinner className="mb-3 border-gray-500" strokeWidth={2} width={8} />
      <div>{message}</div>
    </div>
  ) : (
    <>{children}</>
  );
}
