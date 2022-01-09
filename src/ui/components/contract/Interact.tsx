// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useReducer, useEffect, useState, useRef } from 'react';
import { BN_ZERO } from '@polkadot/util';
import { ResultsOutput } from './ResultsOutput';
import { AccountSelect } from 'ui/components/account';
import { Dropdown, Button, Buttons } from 'ui/components/common';
import {
  ArgumentForm,
  InputGas,
  InputBalance,
  Form,
  FormField,
  getValidation,
} from 'ui/components/form';
import {
  createMessageOptions,
  dryRun,
  NOOP,
  prepareContractTx,
  sendContractQuery,
  transformUserInput,
} from 'api';
import { useApi, useTransactions } from 'ui/contexts';
import { contractCallReducer, initialState } from 'ui/reducers';
import { BN, ContractPromise, RegistryError, SubmittableResult } from 'types';
import { useWeight, useBalance, useArgValues, useFormField, useAccountId } from 'ui/hooks';

interface Props {
  contract: ContractPromise;
}

let nextId = 1;

export const InteractTab = ({ contract }: Props) => {
  const { api, keyring } = useApi();
  const message = useFormField(contract.abi.messages[0]);
  const [argValues, setArgValues] = useArgValues(message.value?.args || []);
  const [state, dispatch] = useReducer(contractCallReducer, initialState);
  const payment = useBalance(100);
  const { value: accountId, onChange: setAccountId, ...accountIdValidation } = useAccountId();
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [txId, setTxId] = useState<number>(0);

  useEffect(() => {
    if (state.results.length > 0) {
      dispatch({
        type: 'RESET',
      });
    }
    nextId = 1;
    message.value = contract.abi.messages[0];
    // clears call results when navigating to another contract page
    // to do: storage for call results
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract.address]);

  useEffect((): void => {
    if (!accountId || !message.value?.args || !argValues) return;

    const sender = keyring?.getPair(accountId);

    if (message.value.isMutating !== true) {
      setEstimatedWeight(null);

      return;
    }

    sender &&
      message.value.isMutating &&
      dryRun({
        contract,
        message: message.value,
        argValues,
        payment: payment.value,
        sender,
      })
        .then(({ gasRequired }) => {
          setEstimatedWeight(gasRequired);
        })
        .catch(e => {
          console.error(e);
          setEstimatedWeight(null);
        });
  }, [api, accountId, argValues, contract, keyring, message.value, payment.value]);

  const weight = useWeight();

  const transformed = transformUserInput(contract.registry, message.value.args, argValues);

  const options = {
    gasLimit: weight.weight.addn(1),
    value: message.value.isPayable ? payment.value || BN_ZERO : undefined,
  };

  const { queue, process } = useTransactions();

  const tx = prepareContractTx(contract.tx[message.value.method], options, transformed);

  const onSuccess = ({ status, dispatchInfo, dispatchError, events }: SubmittableResult) => {
    const callResult = {
      id: nextId,
      isComplete: false,
      data: '',
      log: [],
      message: message.value,
      time: Date.now(),
    };
    const log = events.map(({ event }) => {
      return `${event.section}:${event.method}`;
    });

    dispatch({
      type: 'CALL_FINALISED',
      payload: {
        ...callResult,
        isComplete: true,
        log: log,
        error: dispatchError ? contract.registry.findMetaError(dispatchError.asModule) : undefined,
        blockHash: status.asFinalized.toString(),
        info: dispatchInfo?.toHuman(),
      },
    });
    nextId++;
  };

  const read = async () => {
    const callResult = {
      id: nextId,
      isComplete: false,
      data: '',
      log: [],
      message: message.value,
      time: Date.now(),
    };

    dispatch({
      type: 'CALL_INIT',
      payload: { ...callResult },
    });
    const { result, output } = await sendContractQuery(
      contract.query[message.value.method],
      keyring?.getPair(accountId),
      options,
      transformed
    );

    let error: RegistryError | undefined;

    if (result.isErr && result.asErr.isModule) {
      error = contract.registry.findMetaError(result.asErr.asModule);
    }

    dispatch({
      type: 'CALL_FINALISED',
      payload: {
        ...callResult,
        isComplete: true,
        data: output?.toHuman(),
        error,
      },
    });
    nextId++;
  };

  const isValid = () => true;

  const onError = NOOP;

  const newId = useRef<number>();

  const clickHandler = () => {
    if (tx && accountId) {
      const callResult = {
        id: nextId,
        isComplete: false,
        data: '',
        log: [],
        message: message.value,
        time: Date.now(),
      };

      dispatch({
        type: 'CALL_INIT',
        payload: { ...callResult },
      });
      newId.current = queue({ extrinsic: tx, accountId, onSuccess, onError, isValid });
      setTxId(newId.current);
    }
  };

  useEffect(() => {
    async function processTx() {
      txId && (await process(txId));
    }
    processTx().catch(e => console.error(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txId]);

  if (!contract) return null;

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-6 lg:col-span-7 2xl:col-span-8 rounded-lg w-full">
        <Form>
          <FormField className="mb-8" id="accountId" label="Account" {...accountIdValidation}>
            <AccountSelect
              id="accountId"
              className="mb-2"
              value={accountId}
              onChange={setAccountId}
            />
          </FormField>
          <FormField id="message" label="Message to Send" {...getValidation(message)}>
            <Dropdown
              id="message"
              options={createMessageOptions(contract.abi.messages)}
              className="mb-4"
              {...message}
            >
              No messages found
            </Dropdown>
            {argValues && (
              <ArgumentForm
                args={message.value?.args || []}
                setArgValues={setArgValues}
                argValues={argValues}
              />
            )}
          </FormField>

          {message?.value?.isPayable && (
            <FormField id="value" label="Payment" {...getValidation(payment)}>
              <InputBalance
                value={payment.value}
                onChange={payment.onChange}
                placeholder="Payment"
              />
            </FormField>
          )}
          <FormField
            id="maxGas"
            label="Max Gas Allowed"
            isError={!weight.isValid}
            message={!weight.isValid ? 'Invalid gas limit' : null}
          >
            <InputGas
              estimatedWeight={estimatedWeight}
              isCall={message.value.isMutating}
              withEstimate
              {...weight}
            />
          </FormField>
        </Form>
        <Buttons>
          {message.value.isPayable || message.value.isMutating ? (
            <Button
              isDisabled={!(weight.isValid || weight.isEmpty)}
              isLoading={state.isLoading}
              onClick={() => clickHandler()}
              variant="primary"
            >
              Call
            </Button>
          ) : (
            <Button
              isDisabled={!(weight.isValid || weight.isEmpty)}
              isLoading={state.isLoading}
              onClick={read}
              variant="primary"
            >
              Read
            </Button>
          )}
        </Buttons>
      </div>
      <div className="col-span-6 lg:col-span-5 2xl:col-span-4 pl-10 lg:pl-20 w-full">
        <ResultsOutput results={state.results} />
      </div>
    </div>
  );
};
