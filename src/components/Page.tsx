import React from 'react';
import { useCanvas } from '../api-wrapper';

const Page: React.FC = ({ children }) => {
  const { apiState, keyringState, apiError } = useCanvas();
  return (
    <div className="bg-white h-full grid grid-cols-12">
      <div className="col-span-10 px-16 h-full">
        {apiState === 'ERROR' && `Error connecting to Substrate ${apiError}`}
        {keyringState !== 'READY' &&
          "Loading accounts (please review any extension's authorization)"}
        {apiState !== 'READY' ? 'Connecting to Substrate' : children}
      </div>
    </div>
  );
};

export default Page;
