// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState, useRef } from 'react';
import { ContractSubmittableResult } from '@polkadot/api-contract/base/Contract';
import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { ResultsOutput } from './ResultsOutput';
import { AccountSelect } from 'ui/components/account';
import { Dropdown, Button, Buttons } from 'ui/components/common';
import {
  ArgumentForm,
  InputGas,
  InputBalance,
  InputStorageDepositLimit,
  Form,
  FormField,
} from 'ui/components/form';
import {
  prepareContractTx,
  sendContractQuery,
  transformUserInput,
  getBlockHash,
  BN_ZERO,
} from 'helpers';
import { useApi, useTransactions } from 'ui/contexts';
import { CallResult, ContractPromise, RegistryError, SubmittableResult } from 'types';
import { useWeight, useBalance, useArgValues, useFormField } from 'ui/hooks';
import { useToggle } from 'ui/hooks/useToggle';
import { useStorageDepositLimit } from 'ui/hooks/useStorageDepositLimit';
import { createMessageOptions } from 'ui/util/dropdown';

interface Props {
  contract: ContractPromise;
}

export const InteractTab = ({ contract }: Props) => {
  const { accounts, systemChainType } = useApi();
  const {
    value: message,
    onChange: setMessage,
    ...messageValidation
  } = useFormField(contract.abi.messages[0]);
  const [argValues, setArgValues] = useArgValues(message?.args || []);
  const [callResults, setCallResults] = useState<CallResult[]>([]);
  const { value, onChange: setValue, ...valueValidation } = useBalance(100);
  const [accountId, setAccountId] = useState('');
  const [txId, setTxId] = useState<number>(0);
  const [nextResultId, setNextResultId] = useState(1);
  const [isUsingStorageDepositLimit, toggleIsUsingStorageDepositLimit] = useToggle();
  const [outcome, setOutcome] = useState<ContractCallOutcome>();
  const storageDepositLimit = useStorageDepositLimit(accountId);
  const weight = useWeight(null);

  useEffect((): void => {
    if (!accounts || accounts.length === 0) return;
    setAccountId(accounts[0].address);
  }, [accounts]);

  useEffect(() => {
    setCallResults([]);
    setNextResultId(1);
    setMessage(contract.abi.messages[0]);
    // clears call results and resets data when navigating to another contract page
    // to do: storage for call results
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract.address]);

  useEffect((): void => {
    if (contract.abi.messages[message.index].method !== message.method) return;

    if (message.isMutating !== true) {
      setOutcome(undefined);
      return;
    }

    async function dryRun() {
      const a = transformUserInput(contract.registry, message.args, argValues);

      const o = await contract.query[message.method](
        accountId,
        {
          gasLimit: weight.isActive ? weight.megaGas : -1,
          storageDepositLimit: storageDepositLimit.value ?? null,
        },
        ...a
      );

      setOutcome(o);
    }

    dryRun().catch(e => console.error(e));
  }, [
    accountId,
    argValues,
    contract.abi.messages,
    contract.query,
    contract.registry,
    message,
    storageDepositLimit.value,
    weight.isActive,
    weight.megaGas,
  ]);

  const transformed = transformUserInput(contract.registry, message.args, argValues);

  const options = {
    gasLimit: weight.weight.addn(1),
    storageDepositLimit: isUsingStorageDepositLimit ? storageDepositLimit.value : undefined,
    value: message.isPayable ? value || BN_ZERO : undefined,
  };

  const { queue, process, txs } = useTransactions();

  const onCallSuccess = ({
    status,
    dispatchInfo,
    events,
    contractEvents,
  }: ContractSubmittableResult) => {
    const log = events.map(({ event }) => {
      return `${event.section}:${event.method}`;
    });
    contractEvents?.forEach(({ event, args }) => {
      console.log('event', event.identifier);
      args.forEach((a, i) => console.log(`${event.args[i].name}-`, a.toHuman()));
    });
    setCallResults([
      ...callResults,
      {
        id: nextResultId,
        data: null,
        isComplete: true,
        message,
        time: Date.now(),
        log,
        blockHash: getBlockHash(status, systemChainType),
        info: dispatchInfo?.toHuman(),
      },
    ]);

    setNextResultId(nextResultId + 1);
  };
  const onCallError = ({
    events,
    dispatchError,
    contractEvents,
    dispatchInfo,
  }: ContractSubmittableResult) => {
    const log = events.map(({ event }) => {
      return `${event.section}:${event.method}`;
    });
    contractEvents?.forEach(({ event, args }) => {
      console.log(event.identifier);
      args.forEach((a, i) => console.log(`${event.args[i].name}-${a.toHuman()}`));
    });
    setCallResults([
      ...callResults,
      {
        id: nextResultId,
        message,
        time: Date.now(),
        isComplete: true,
        data: null,
        error: dispatchError ? contract.registry.findMetaError(dispatchError.asModule) : undefined,
        log,
        info: dispatchInfo?.toHuman(),
      },
    ]);

    setNextResultId(nextResultId + 1);
  };
  const read = async () => {
    const { result, output } = await sendContractQuery(
      contract.query[message.method],
      accountId,
      options,
      transformed
    );

    let error: RegistryError | undefined;

    if (result.isErr && result.asErr.isModule) {
      error = contract.registry.findMetaError(result.asErr.asModule);
    }

    setCallResults([
      ...callResults,
      {
        id: nextResultId,
        log: [],
        message,
        time: Date.now(),
        isComplete: true,
        data: output,
        error,
      },
    ]);

    setNextResultId(nextResultId + 1);
  };

  const isValid = (result: SubmittableResult) => !result.isError && !result.dispatchError;

  const newId = useRef<number>();

  const call = () => {
    const tx = prepareContractTx(contract.tx[message.method], options, transformed);
    if (tx && accountId) {
      newId.current = queue({
        extrinsic: tx,
        accountId,
        onSuccess: onCallSuccess,
        onError: onCallError,
        isValid,
      });
      setTxId(newId.current);
    }
  };

  useEffect(() => {
    async function processTx() {
      txs[txId]?.status === 'queued' && (await process(txId));
    }
    processTx().catch(e => console.error(e));
  }, [process, txId, txs]);

  if (!contract) return null;

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-6 lg:col-span-6 2xl:col-span-7 rounded-lg w-full">
        <Form>
          <FormField
            className="mb-8 caller"
            help="The sending account for this interaction. Any transaction fees will be deducted from this account."
            id="accountId"
            label="Account"
          >
            <AccountSelect
              id="accountId"
              className="mb-2"
              value={accountId}
              onChange={setAccountId}
            />
          </FormField>
          <FormField
            help="The message to send to this contract. Parameters are adjusted based on the stored contract metadata."
            id="message"
            label="Message to Send"
            {...messageValidation}
          >
            <Dropdown
              id="message"
              options={createMessageOptions(contract.abi.registry, contract.abi.messages)}
              className="constructorDropdown mb-4"
              onChange={setMessage}
              value={message}
            >
              No messages found
            </Dropdown>
            {argValues && (
              <ArgumentForm
                args={message.args || []}
                registry={contract.abi.registry}
                setArgValues={setArgValues}
                argValues={argValues}
              />
            )}
          </FormField>

          {message.isPayable && (
            <FormField
              help="The balance to transfer to the contract as part of this call."
              id="value"
              label="Payment"
              {...valueValidation}
            >
              <InputBalance value={value} onChange={setValue} placeholder="Value" />
            </FormField>
          )}
          <FormField
            help="The maximum amount of gas (in millions of units) to use for this contract call. If the call requires more, it will fail."
            id="maxGas"
            label="Max Gas Allowed"
            isError={!weight.isValid}
            message={!weight.isValid ? 'Invalid gas limit' : null}
          >
            <InputGas isCall={message.isMutating} withEstimate {...weight} />
          </FormField>
          <FormField
            help="The maximum balance allowed to be deducted from the sender account for any additional storage deposit."
            id="storageDepositLimit"
            label="Storage Deposit Limit"
            isError={!storageDepositLimit.isValid}
            message={
              !storageDepositLimit.isValid
                ? storageDepositLimit.message || 'Invalid storage deposit limit'
                : null
            }
          >
            <InputStorageDepositLimit
              isActive={isUsingStorageDepositLimit}
              toggleIsActive={toggleIsUsingStorageDepositLimit}
              {...storageDepositLimit}
            />
          </FormField>
        </Form>
        <Buttons>
          {message.isPayable || message.isMutating ? (
            <Button
              isDisabled={
                !(weight.isValid || !weight.isActive || txs[txId]?.status === 'processing')
              }
              isLoading={txs[txId]?.status === 'processing'}
              onClick={call}
              variant="primary"
            >
              Call
            </Button>
          ) : (
            <Button
              isDisabled={!(weight.isValid || !weight.isActive)}
              onClick={read}
              variant="primary"
            >
              Read
            </Button>
          )}
        </Buttons>
      </div>
      <div className="col-span-6 lg:col-span-6 2xl:col-span-5 pl-10 lg:pl-20 w-full">
        <ResultsOutput registry={contract.registry} results={callResults} outcome={outcome} />
      </div>
    </div>
  );
};
