import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  message?: React.ReactNode;
}

export function Loader ({ children, isLoading, message = 'Loading...'}: Props): React.ReactElement {
  return isLoading
    ? (
      <div className="text-lg my-32 font-bolder w-full h-full max-w-5xl flex flex-col items-center">
        <div style={{borderTopColor: 'transparent'}}
          className="w-16 h-16 mb-3 border-4 dark:border-gray-600 border-blue-400 border-solid rounded-full animate-spin"></div>
        <div>{message}</div>
      </div>
    )
    : (
      <>
        {children}
      </>
    )
}