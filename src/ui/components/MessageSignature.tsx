// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { DatabaseIcon, CashIcon } from '@heroicons/react/solid';

interface Props {
  method: string;
  isPayable?: boolean;
  isMutating?: boolean;
  returnType?: string;
}

export const MessageSignature = ({ isPayable, isMutating, method, returnType }: Props) => {
  return (
    <div className="text-mono flex flex-wrap leading-relaxed">
      <span className="text-yellow-300">{method}</span>
      {returnType ? (
        <>
          <span className="mr-1">():</span>
          <span>{returnType}</span>
        </>
      ) : (
        <span>()</span>
      )}
      {isMutating && <DatabaseIcon className="w-4 h-4 ml-2 icon-mutating" />}
      {isPayable && <CashIcon className="w-4 h-4 ml-2 icon-payable" />}
    </div>
  );
};
