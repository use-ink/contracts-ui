// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';
import { CanvasContext } from '../contexts';
import Homepage from './Homepage';

export default function Main(): JSX.Element {
  return (
    <CanvasContext.Consumer>
      {({ status, keyringStatus, error }) => (
        <div className="bg-white h-full grid grid-cols-12">
          <div className="col-span-10 px-16 h-full">
            {status === 'READY' && keyringStatus === 'READY' ? (
              <Homepage />
            ) : status === 'ERROR' ? (
              `Connection error ${error}`
            ) : keyringStatus !== 'READY' ? (
              "Loading accounts (please review any extension's authorization)"
            ) : (
              'Connecting to substrate node'
            )}
          </div>
        </div>
      )}
    </CanvasContext.Consumer>
  );
}
