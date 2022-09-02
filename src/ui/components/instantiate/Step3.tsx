// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useParams } from 'react-router';
import { Account } from '../account/Account';
import { Button, Buttons } from '../common/Button';
import { useInstantiate, isResultValid } from 'ui/contexts';
import { useQueueTx } from 'ui/hooks/useQueueTx';
import { truncate } from 'helpers';

export function Step3() {
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();
  const { data, step, onUnFinalize, tx, onError, onInstantiate } = useInstantiate();
  const { accountId, value, metadata, weight, name, constructorIndex } = data;

  const displayHash = codeHashUrlParam || metadata?.info.source.wasmHash.toHex();

  const [onSubmit, onCancel, isValid, isProcessing] = useQueueTx(
    tx ?? null,
    data.accountId,
    onError,
    isResultValid,
    onInstantiate
  );

  if (step !== 3) return null;

  return (
    <>
      <div className="review">
        <div className="field full">
          <p className="key">Account</p>
          <div className="value">
            <Account value={accountId} />
          </div>
        </div>

        <div className="field full">
          <p className="key">Name</p>
          <p className="value">{name}</p>
        </div>
        {metadata?.constructors[constructorIndex].isPayable && value && (
          <div className="field">
            <p className="key">Value</p>
            <p className="value">{value.toNumber().toLocaleString()}</p>
          </div>
        )}

        <div className="field">
          <p className="key">Weight</p>
          <p className="value">{weight.toNumber().toLocaleString()}</p>
        </div>

        {displayHash && (
          <div className="field">
            <p className="key">Code Hash</p>
            <p className="value">{truncate(displayHash)}</p>
          </div>
        )}

        {tx?.args[3] && (
          <div className="field">
            <p className="key">Data</p>
            <p className="value">{truncate(tx?.args[3].toHex())}</p>
          </div>
        )}
      </div>
      <Buttons>
        <Button
          variant="primary"
          isDisabled={!isValid}
          isLoading={isProcessing}
          onClick={onSubmit}
          data-cy="submit-btn"
        >
          Upload and Instantiate
        </Button>

        <Button
          onClick={(): void => {
            onCancel();
            onUnFinalize && onUnFinalize();
          }}
          isDisabled={isProcessing}
        >
          Go Back
        </Button>
      </Buttons>
    </>
  );
}
