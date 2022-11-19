// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BN from 'bn.js';
import { Meter } from '../common/Meter';
import { InputNumber } from './InputNumber';
import { UIGas } from 'types';
import { MAX_CALL_WEIGHT } from 'src/constants';

export function InputWeight({
  setLimit,
  mode,
  setMode,
  setErrorMsg,
  setIsValid,
  limit,
  name,
  text,
  setText,
}: UIGas & { name: string }) {
  return (
    <>
      <InputNumber
        value={text}
        disabled={mode === 'estimation'}
        onChange={e => {
          if (mode === 'custom') {
            const bn = new BN(e.target.value);
            if (bn.lte(MAX_CALL_WEIGHT)) {
              if (!bn.eq(limit)) {
                setText(e.target.value);
                setLimit(bn);
                setErrorMsg('');
                setIsValid(true);
              }
            } else {
              setErrorMsg('Value exceeds maximum block weight');
              setIsValid(false);
            }
          }
        }}
        placeholder="MGas"
        data-cy="refTime-input"
        min="0"
        className="disabled:opacity-60"
      />
      <Meter
        accessory={
          mode === 'custom' ? (
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setMode('estimation');
              }}
              data-cy={`use-estimated-${name}`}
              className="text-green-500"
            >
              <span> {`Use Estimation`}</span>
            </a>
          ) : (
            <>
              <span> {`Using Estimation`}</span>
              &nbsp;{' · '}&nbsp;
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setMode('custom');
                }}
                className="text-green-500"
                data-cy="use-custom-refTime"
              >
                Use Custom
              </a>
            </>
          )
        }
        withAccessory={true}
      />
    </>
  );
}
