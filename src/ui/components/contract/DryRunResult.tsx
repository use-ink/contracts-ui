// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { encodeTypeDef } from '@polkadot/types';
import { AbiMessage, ContractCallOutcome } from '@polkadot/api-contract/types';
import { CopyButton } from '../common/CopyButton';
import { useApi } from 'ui/contexts';
import { isBn, fromSats } from 'helpers';

export function DryRunResult({
  outcome,
  message,
}: {
  outcome: ContractCallOutcome;
  message: AbiMessage;
}) {
  const { api, tokenSymbol } = useApi();
  const rawOutput = outcome?.output;
  const output = rawOutput?.toHuman();
  const formattedBallance =
    !!message.returnType &&
    encodeTypeDef(api.registry, message.returnType) === 'u128' &&
    isBn(rawOutput)
      ? `${fromSats(api, rawOutput)} ${tokenSymbol}`
      : undefined;

  const isError = output && typeof output === 'object' && 'Err' in output;

  return isError ? (
    <div>{output.Err?.toString()}</div>
  ) : (
    <>
      {output !== undefined && output !== 'Ok' && (
        <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600">
          {formattedBallance ?? JSON.stringify(output, null, 2)}
          <CopyButton className="float-right" value={outcome.output?.toString() ?? ''} />
        </div>
      )}
      {message.isMutating && (
        <>
          <div className="mb-1">GasRequired</div>
          <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600 mb-2">
            {outcome?.gasRequired.toHuman()}
            <CopyButton className="float-right" value={outcome.gasRequired.toString() ?? ''} />
          </div>
          <div className="mb-1">StorageDeposit</div>
          <div className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-mono text-xs return-value dark:text-gray-400 text-gray-600">
            <>
              {outcome?.storageDeposit.asCharge.toHuman()}
              <CopyButton
                className="float-right"
                value={outcome.storageDeposit.asCharge.toString() ?? ''}
              />
            </>
          </div>
        </>
      )}
    </>
  );
}
