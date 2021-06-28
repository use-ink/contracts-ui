import React, { ReactNode } from 'react';
import { CanvasContext } from '../contexts';

interface Props {
  children?: ReactNode;
}

export default function Main({ children }: Props): React.ReactElement<Props> {
  return (
    <CanvasContext.Consumer>
      {({ apiState, keyringState, apiError }) => (
        <>
          {apiState === 'READY' && keyringState === 'READY' ? (
            <div className="w-full mx-auto overflow-y-auto">
              <div className="grid lg:grid-cols-12 gap-5 px-5 py-3 m-2">{children}</div>
            </div>
          ) : apiState === 'ERROR' ? (
            `Connection error ${apiError}`
          ) : keyringState !== 'READY' ? (
            "Loading accounts (please review any extension's authorization)"
          ) : (
            'Connecting to substrate node'
          )}
        </>
      )}
    </CanvasContext.Consumer>
  );
}
