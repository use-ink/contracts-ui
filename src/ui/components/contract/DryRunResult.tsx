// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import { CopyButton } from '../common/CopyButton';
import { useDecodedOutput } from 'ui/hooks';
import { decodeStorageDeposit } from 'helpers';

interface Props {
  outcome: ContractCallOutcome;
  message: AbiMessage;
}

export function DryRunResult({
  outcome: { output, gasRequired, storageDeposit, debugMessage },
  message,
}: Props) {
  const { decodedOutput, isError } = useDecodedOutput(output, message.returnType);
  const { storageDepositValue, storageDepositType } = decodeStorageDeposit(storageDeposit);

  return (
    <div data-cy={`dryRun-${message.method}`}>
      {isError ? (
        <div className="text-red-400">
          <div>{decodedOutput}</div>
          <div>{debugMessage.toHuman()}</div>
        </div>
      ) : (
        <>
          {decodedOutput !== 'Ok' && decodedOutput.trim() !== '' && (
            <div
              className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600 mb-2 break-all"
              data-cy="output"
            >
              {decodedOutput}
              <CopyButton className="float-right" value={output?.toString() ?? ''} />
            </div>
          )}
          {(message.isMutating || message.isPayable) && (
            <>
              <div className="mb-1">GasRequired</div>
              <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600 mb-2">
                {gasRequired.toHuman()}
                <CopyButton className="float-right" value={gasRequired.toString() ?? ''} />
              </div>
              <div className="mb-1">{`StorageDeposit`}</div>
              <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600">
                <>
                  {storageDepositType}: {storageDepositValue?.toHuman() ?? 'none'}
                  <CopyButton
                    className="float-right"
                    value={storageDepositValue?.toString() ?? ''}
                  />
                </>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
