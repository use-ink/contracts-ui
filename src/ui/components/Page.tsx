// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import React from 'react';
import { useCanvas } from '../contexts';

const Page: React.FC = ({ children }) => {
  const { status, keyringStatus, error } = useCanvas();

  return (
    <div className="bg-white h-full grid grid-cols-12">
      <div className="col-span-10 px-16 h-full">
        {status === 'ERROR' && `Error connecting to Substrate ${error}`}
        {keyringStatus !== 'READY' &&
          "Loading accounts (please review any extension's authorization)"}
        {status !== 'READY' ? 'Connecting to Substrate' : children}
      </div>
    </div>
  );
};

export default Page;