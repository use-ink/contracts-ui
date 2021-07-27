import React, { useMemo } from "react";
import type { HTMLAttributes } from 'react';
import { useCanvas, useDatabase } from "ui/contexts";
import { usePopulateDevDb } from "ui/hooks";

export function AwaitApis ({ children }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  const { error, status, keyringStatus } = useCanvas();
  const { isDbReady } = useDatabase();
  const needsMockData = usePopulateDevDb();

  const content = useMemo(
    (): React.ReactNode => {
      if (!isDbReady) {
        return <>Initializing database...</>
      }
    
      if (keyringStatus !== 'READY') {
        return <>Loading accounts...</>
      }
    
      if (status !== 'READY') {
        return <>Connecting...</>
      }
    
      if (needsMockData !== false) {
        return <>Populating development database...</>
      }
    
      if (error) {
        return <>{error}</>;
      }

      return children;
    
    },
    [children, error, needsMockData, keyringStatus, status, isDbReady]
  )


  return (
    <div className="dark text-white w-full">
      {content}
    </div>
  );
}