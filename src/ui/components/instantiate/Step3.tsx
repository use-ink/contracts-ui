// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { BN_ZERO, formatBalance, formatNumber } from '@polkadot/util';
import { Account } from '../account/Account';
import { Button, Buttons } from '../common/Button';
import { useApi, useInstantiate } from 'ui/contexts';
// import { useQueueTx } from 'ui/hooks/useQueueTx';
import { fromSats } from 'api';
import { truncate } from 'ui/util';

export function Step3() {
  const { api } = useApi();
  const instantiateState = useInstantiate();

  const {
    data: { accountId, codeHash, endowment, metadata, weight, name },
  } = instantiateState;

  // const [onSubmit, onCancel, isValid, isProcessing] = useQueueTx(
  //   tx,
  //   accountId.value,
  //   onInstantiate,
  //   onError,
  //   isResultValid
  // );

  const displayHash = codeHash || metadata?.info.source.wasmHash.toHex() || null;

  return (
    <>
      <div className="review">
        <div className="field full">
          <p className="key">Account</p>
          <div className="value">
            <Account className="p-0" value={accountId} />
          </div>
        </div>

        <div className="field full">
          <p className="key">Name</p>
          <p className="value">{name}</p>
        </div>

        <div className="field">
          <p className="key">Endowment</p>
          <p className="value">
            {formatBalance(fromSats(api, endowment || BN_ZERO), { forceUnit: '-' })}
          </p>
        </div>

        <div className="field">
          <p className="key">Weight</p>
          <p className="value">{formatNumber(weight)}</p>
        </div>

        {displayHash && (
          <div className="field">
            <p className="key">Code Hash</p>
            <p className="value">{truncate(displayHash)}</p>
          </div>
        )}

        {/* {tx?.args[3] && (
          <div className="field">
            <p className="key">Data</p>
            <p className="value">{tx?.args[3].toHex()}</p>
          </div>
        )} */}
      </div>
      <Buttons>
        {/* <Button variant="primary" isDisabled={!isValid} isLoading={isProcessing} onClick={onSubmit}>
          Upload and Instantiate
        </Button> */}

        <Button
          onClick={(): void => {
            // onCancel();
            // onUnFinalize && onUnFinalize();
          }}
        >
          Go Back
        </Button>
      </Buttons>
    </>
  );
}
