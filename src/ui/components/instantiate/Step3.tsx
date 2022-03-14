// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { formatBalance, formatNumber } from '@polkadot/util';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Account } from '../account/Account';
import { Button, Buttons } from '../common/Button';
import { useApi, useInstantiate, isResultValid } from 'ui/contexts';
import { useQueueTx } from 'ui/hooks/useQueueTx';

import { fromSats } from 'api';
import { truncate } from 'ui/util';

export function Step3() {
  const { t } = useTranslation();
  const apiState = useApi();
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();
  const { data, currentStep, onUnFinalize, tx, onError, onInstantiate } = useInstantiate();
  const { accountId, value, metadata, weight, name, constructorIndex } = data;
  const isConstructorPayable = metadata?.constructors[constructorIndex].isPayable;

  const displayHash = codeHashUrlParam || metadata?.info.source.wasmHash.toHex();

  const [onSubmit, onCancel, isValid, isProcessing] = useQueueTx(
    tx,
    data.accountId,
    onInstantiate,
    onError,
    isResultValid
  );

  if (currentStep !== 3) return null;

  return (
    <>
      <div className="review">
        <div className="field full">
          <p className="key">
            {t('account', 'Account')}
          </p>
          <div className="value">
            <Account className="p-0" value={accountId} />
          </div>
        </div>

        <div className="field full">
          <p className="key">
            {t('name', 'Name')}
          </p>
          <p className="value">{name}</p>
        </div>
        {isConstructorPayable && (
          <div className="field">
            <p className="key">
              {t('value', 'Value')}
            </p>
            <p className="value">
              {formatBalance(fromSats(apiState.api, value), { forceUnit: '-' })}
            </p>
          </div>
        )}

        <div className="field">
          <p className="key">{t('weight', 'Weight')}</p>
          <p className="value">{formatNumber(weight)}</p>
        </div>

        {displayHash && (
          <div className="field">
            <p className="key">{t('codeHash', 'Code hash')}</p>
            <p className="value">{truncate(displayHash)}</p>
          </div>
        )}

        {tx?.args[3] && (
          <div className="field">
            <p className="key">{t('data', 'Data')}</p>
            <p className="value">{truncate(tx?.args[3].toHex())}</p>
          </div>
        )}
      </div>
      <Buttons>
        <Button variant="primary" isDisabled={!isValid} isLoading={isProcessing} onClick={onSubmit}>
          {t('uploadAndInstantiate', 'Upload and Instantiate')}
        </Button>

        <Button
          onClick={(): void => {
            onCancel();
            onUnFinalize && onUnFinalize();
          }}
          isDisabled={isProcessing}
        >
          {t('back', 'Go Back')}
        </Button>
      </Buttons>
    </>
  );
}
