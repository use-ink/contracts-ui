// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SubmittableResult } from '@polkadot/api';
import { VoidFn } from '@polkadot/api/types';
import { isNull } from '@polkadot/util';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SubmittableExtrinsic } from 'types';
import { useTransactions } from 'ui/contexts/TransactionsContext';

export function useQueueTx(
  extrinsic: SubmittableExtrinsic<'promise'> | null,
  accountId: string | null | undefined,
  onSuccess: (_: SubmittableResult) => Promise<void>,
  onError: VoidFn,
  isValid: (_: SubmittableResult) => boolean
): [VoidFn, VoidFn, boolean, boolean] {
  const { queue, dismiss, process, txs } = useTransactions();
  const [txId, setTxId] = useState<number>(0);

  const txIdRef = useRef(txId);

  const isProcessing = useMemo(
    (): boolean => !!(txs[txId] && txs[txId]?.status === 'processing'),
    [txs, txId]
  );

  const onSubmit = useCallback((): void => {
    txId && process(txId);
  }, [process, txId]);

  const onCancel = useCallback((): void => {
    txId && dismiss(txId);
    setTxId(0);
  }, [dismiss, txId]);

  useEffect((): void => {
    if (extrinsic && accountId && txId === 0) {
      const newId = queue({ extrinsic, accountId, onSuccess, onError, isValid });

      setTxId(newId);
      txIdRef.current = newId;
    }
  }, [accountId, extrinsic, isValid, onError, onSuccess, queue, txId]);

  return [onSubmit, onCancel, !isNull(txId), isProcessing];
}
