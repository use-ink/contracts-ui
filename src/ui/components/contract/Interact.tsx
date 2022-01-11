// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useReducer, useEffect, useState } from 'react';
import { Dropdown } from '../common/Dropdown';
import { ArgumentForm } from '../form/ArgumentForm';
import { Button, Buttons } from '../common/Button';
import { AccountSelect } from '../account/AccountSelect';
import { Form, FormField, getValidation } from '../form/FormField';
import { InputBalance } from '../form/InputBalance';
import { InputGas } from '../form/InputGas';
import { ResultsOutput } from './ResultsOutput';
import { call, createMessageOptions, dryRun } from 'api';
import { useApi } from 'ui/contexts';
import { contractCallReducer, initialState } from 'ui/reducers';
import { BN, Contract } from 'types';
import { useAccountId } from 'ui/hooks/useAccountId';
import { useFormField } from 'ui/hooks/useFormField';
import { useArgValues } from 'ui/hooks/useArgValues';
import { useBalance } from 'ui/hooks/useBalance';
import { useWeight } from 'ui/hooks';
import { useStorageDepositLimit } from 'ui/hooks/useStorageDepositLimit';
import { InputStorageDepositLimit } from '../form/InputStorageDepositLimit';
import { useToggle } from 'ui/hooks/useToggle';

interface Props {
  contract: Contract;
}

export const InteractTab = ({ contract }: Props) => {
  const { api, keyring } = useApi();
  const message = useFormField(contract.abi.messages[0]);
  const [argValues, setArgValues] = useArgValues(message.value?.args || []);
  const [state, dispatch] = useReducer(contractCallReducer, initialState);
  const payment = useBalance(100);
  const { value: accountId, onChange: setAccountId, ...accountIdValidation } = useAccountId();
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [isUsingStorageDepositLimit, toggleIsUsingStorageDepositLimit] = useToggle();

  useEffect(() => {
    if (state.results.length > 0) {
      dispatch({
        type: 'RESET',
      });
    }
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
  const storageDepositLimit = useStorageDepositLimit(accountId);

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
            <FormField id="endowment" label="Payment" {...getValidation(payment)}>
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
          <FormField
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
          <Button
            isDisabled={!(weight.isValid || weight.isEmpty)}
            isLoading={state.isLoading}
            onClick={() => {
              const sender = keyring?.getPair(accountId);

              if (sender) {
                call({
                  contract,
                  payment: payment.value,
                  gasLimit: weight.weight,
                  storageDepositLimit: storageDepositLimit.value,
                  argValues,
                  message: message.value,
                  sender,
                  dispatch,
                })
                  .then()
                  .catch(console.error);
              }
            }}
            variant="primary"
          >
            {message.value.isMutating ? 'Call' : 'Read'}
          </Button>
        </Buttons>
      </div>
      <div className="col-span-6 lg:col-span-5 2xl:col-span-4 pl-10 lg:pl-20 w-full">
        <ResultsOutput results={state.results} />
      </div>
    </div>
  );
};
