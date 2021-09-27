import React, { useCallback, useState } from 'react';
import BN from 'bn.js';
import { BN_ZERO } from '@polkadot/util';
import { Input } from './Input';
import { SimpleSpread } from 'types';
import { useCanvas } from 'ui/contexts';
import { fromBalance, fromSats, toBalance } from 'canvas/util';

type Props =  SimpleSpread<
  React.InputHTMLAttributes<HTMLInputElement>,
  {
    value?: BN | null;
    onChange: (_?: BN | null) => void;
  }
>;

function InputBalanceBase ({ children, value = BN_ZERO, onChange: _onChange, ...props }: Props) {
  const { api, tokenSymbol } = useCanvas();

  const [stringValue, setStringValue] = useState(fromBalance(fromSats(api, value || BN_ZERO)));

  const onChange = useCallback(
    (value: string): void => {
      setStringValue(value);

      const bn = toBalance(api, value);

      _onChange(bn)
    },
    []
  )

  return (
    <>
      <div className="relative rounded-md shadow-sm">
        <Input
          onChange={onChange}
          onFocus={(e) => e.target.select()}
          pattern="^\d*\.?\d*?$"
          value={stringValue}
          {...props}
        >
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="unit" className="sr-only">
              Unit
            </label>
            <select
              disabled
              id="unit"
              name="unit"
              className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
            >
              <option value={tokenSymbol}>{tokenSymbol}</option>
            </select>
          </div>
          {children}
        </Input>

      </div>
    </>
  );
};

export const InputBalance = React.memo(InputBalanceBase);
