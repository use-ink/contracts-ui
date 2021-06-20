import React from 'react';
import { CanvasContext } from '../contexts';
import Homepage from './Homepage';

export default function Main(): JSX.Element {
  return (
    <CanvasContext.Consumer>
      {({ apiState, keyringState, apiError }) => (
        <div className="bg-white h-full grid grid-cols-12">
          <div className="col-span-10 px-16 h-full">
            {apiState === 'READY' && keyringState === 'READY' ? (
              <Homepage />
            ) : apiState === 'ERROR' ? (
              `Connection error ${JSON.stringify(apiError)}`
            ) : keyringState !== 'READY' ? (
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
