import React, { useMemo } from "react";
import type { HTMLAttributes } from 'react';
import { useCanvas, useDatabase } from "ui/contexts";

export function AwaitApis ({ children }: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  const { error, status, keyringStatus } = useCanvas();
  const { isDbReady } = useDatabase();

  const loadingText = useMemo(
    (): string | null => {
      if (error) {
        return `Connection error`;
      }    

      if (!isDbReady) {
        return 'Initializing database...'
      }
    
      if (keyringStatus !== 'READY') {
        return 'Loading accounts...'
      }
    
      if (status !== 'READY') {
        return 'Connecting...'
      }

      return null
    },
    [children, error, keyringStatus, status, isDbReady]
  )

  return loadingText
    ? (
      <div className="text-lg my-32 font-bolder w-full h-full max-w-5xl flex flex-col items-center">
        <div style={{borderTopColor: 'transparent'}}
          className="w-16 h-16 mb-3 border-4 dark:border-gray-600 border-blue-400 border-solid rounded-full animate-spin"></div>
        <div>{loadingText}</div>
      </div>
    )
    : <>{children}</>
}