import React from 'react';

interface Props {
  message?: string;
}
export const OverlayLoader = ({ message = 'Loading...' }: Props) => (
  <div className="w-full h-full fixed flex top-0 left-0 bg-gray-900 opacity-75 z-50">
    <div className="m-auto flex flex-col justify-center items-center">
      <div
        style={{ borderTopColor: 'transparent' }}
        className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin mb-4"
      ></div>
      <div>{message}</div>
    </div>
  </div>
);
