// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Account } from '../account/Account';
import { Button, Buttons } from '../common/Button';
import { printBN } from 'lib/bn';
import { createInstantiateTx } from 'services/chain';
import { SubmittableResult } from 'types';
import { useApi, useInstantiate, useTransactions } from 'ui/contexts';
import { useNewContract } from 'ui/hooks';

export function Step3() {
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();
  const { data, step, setStep } = useInstantiate();
  const { api } = useApi();
  const { accountId, value, metadata, gasLimit, name, constructorIndex } = data;
  const { queue, process, txs, dismiss } = useTransactions();
  const [txId, setTxId] = useState<number>(0);
  const onSuccess = useNewContract();

  const codeHash = codeHashUrlParam || metadata?.info.source.wasmHash.toHex();

  useEffect(() => {
    const isValid = (result: SubmittableResult) => !result.isError && !result.dispatchError;

    if (data.accountId) {
      const tx = createInstantiateTx(api, data);

      if (!txId) {
        const newId = queue({
          extrinsic: tx,
          accountId: data.accountId,
          onSuccess,
          isValid,
        });
        setTxId(newId);
      }
    }
  }, [api, data, queue, onSuccess, txId]);

  const call = () => {
    async function processTx() {
      txs[txId]?.status === 'queued' && (await process(txId));
    }
    processTx().catch(e => console.error(e));
  };

  if (step !== 3) return null;

  return (
    <>
      <div className="review">
        <div className="field full">
          <p className="key">Deployer</p>
          <div className="value">
            <Account value={accountId} />
          </div>
        </div>

        <div className="field full">
          <p className="key">Contract Name</p>
          <p className="value">{name}</p>
        </div>
        {metadata?.constructors[constructorIndex].isPayable && value && (
          <div className="field full">
            <p className="key">Value</p>
            <p className="value">{printBN(value)}</p>
          </div>
        )}

        <div className="field full">
          <p className="key">Weight</p>
          <p className="value">{gasLimit && printBN(gasLimit.refTime.toBn())}</p>
        </div>

        {codeHash && (
          <div className="field full">
            <p className="key">Code Hash</p>
            <p className="value">{codeHash}</p>
          </div>
        )}

        {txs[txId]?.extrinsic.args[3] && (
          <div className="field full">
            <p className="key">Data</p>
            <textarea
              className="value w-full bg-transparent text-sm"
              readOnly
              rows={4}
              value={txs[txId]?.extrinsic.args[3].toHex()}
            />
          </div>
        )}
      </div>

      <Buttons>
        <Button
          isDisabled={txs[txId]?.status === 'processing'}
          onClick={(): void => {
            dismiss(txId);
            setTxId(0);
            setStep(2);
          }}
        >
          Go Back
        </Button>
        <Button
          data-cy="submit-btn"
          isDisabled={!txs[txId]?.isValid}
          isLoading={txs[txId]?.status === 'processing'}
          onClick={() => call()}
          variant="primary"
        >
          Upload and Instantiate
        </Button>
      </Buttons>
    </>
  );
}
