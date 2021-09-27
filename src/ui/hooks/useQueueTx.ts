import { SubmittableResult } from "@polkadot/api";
import { VoidFn } from "@polkadot/api/types";
import { isNull } from "@polkadot/util";
import { useCallback, useEffect, useRef, useState } from "react";
import { SubmittableExtrinsic } from "types";
import { useTransactions } from "ui/contexts/TransactionsContext";

export function useQueueTx (tx: SubmittableExtrinsic<'promise'> | null, accountId: string | null | undefined, onSuccess: (_: SubmittableResult) => Promise<void>, onError: VoidFn, isValid: (_: SubmittableResult) => boolean): [VoidFn, VoidFn, boolean] {
  const { queue, unqueue, process } = useTransactions();
  const [txId, setTxId] = useState<number | null>(null)

  const txIdRef = useRef(txId);

  useEffect(
    (): void => {
      if (tx && accountId && isNull(txId)) {
        const newId = queue(
          tx, accountId, onSuccess, onError, isValid
        );
  
        setTxId(newId);
        txIdRef.current = newId
      }
    },
    []
  );

  // useEffect(
  //   (): () => void => {
  //     return () => {
  //       !isNull(txIdRef.current) && unqueue(txIdRef.current);
  //     }
  //   },
  //   []
  // );


  // useEffect(
  //   (): void => {
  //   },
  //   [tx, txId]
  // )

  const onSubmit = useCallback(
    (): void => {
      txId && process(txId);
    },
    [process, txId]
  )

  const onCancel = useCallback(
    (): void => {
      txId && unqueue(txId);
    },
    [unqueue, txId]
  )

  return [onSubmit, onCancel, !isNull(txId)];
}
