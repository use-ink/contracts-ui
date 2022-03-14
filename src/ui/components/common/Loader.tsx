import React from 'react';
import { Spinner } from './Spinner';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  message?: React.ReactNode;
}

export function Loader({ children, isLoading, message = 'Loading...' }: Props): React.ReactElement {
  return isLoading ? (
    <div className="text-lg my-32 font-bolder w-full h-full max-w-5xl flex flex-col items-center">
      <Spinner className="mb-3" />
      <div>{message}</div>
    </div>
  ) : (
    <>{children}</>
  );
}
