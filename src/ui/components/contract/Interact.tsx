// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useReducer, useEffect } from 'react';
import { Dropdown } from '../Dropdown';
import { ArgumentForm } from '../args/ArgumentForm';
import { Button, Buttons } from '../Button';
import { Input } from '../Input';
import { AccountSelect } from '../AccountSelect';
import { Form, FormField, getValidation } from '../FormField';
import { ResultsOutput } from './ResultsOutput';
import { call, convertToNumber, createMessageOptions } from 'api';
import { useApi } from 'ui/contexts';
import { contractCallReducer, initialState } from 'ui/reducers';
import { AbiMessage, ContractPromise } from 'types';
import { useAccountId } from 'ui/hooks/useAccountId';
import { useFormField } from 'ui/hooks/useFormField';
import { useArgValues } from 'ui/hooks/useArgValues';

interface Props {
  contract: ContractPromise;
}

export const InteractTab = ({ contract }: Props) => {
  const { api, keyring } = useApi();
  const message = useFormField(contract.abi.messages[0]);
  const [argValues, setArgValues] = useArgValues(message.value?.args || []);
  const [state, dispatch] = useReducer(contractCallReducer, initialState);
  const [endowment, setEndowment] = useState('');
  const accountId = useAccountId();

  useEffect(() => {
    if (state.results.length > 0) {
      dispatch({
        type: 'RESET',
      });
    }
  }, [contract.address]);

  if (!contract) return null;

  return (
    <div className="grid grid-cols-12 w-full">
      <div className="col-span-6 lg:col-span-7 2xl:col-span-8 rounded-lg w-full">
        <Form>
          <FormField className="mb-8" id="accountId" label="Account" {...getValidation(accountId)}>
            <AccountSelect id="accountId" className="mb-2" {...accountId} />
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
            <>
              <h2 className="mb-2 text-sm">Payment</h2>
              <Input value={endowment} onChange={setEndowment} placeholder="Endowment" />
            </>
          )}
        </Form>
        <Buttons>
          <Button
            isLoading={state.isLoading}
            onClick={() =>
              message &&
              call({
                api,
                abi: contract.abi,
                contractAddress: contract.address.toString(),
                endowment: convertToNumber(endowment.trim()),
                gasLimit: 155852802980,
                argValues,
                message: message.value as AbiMessage,
                keyringPair: accountId.value ? keyring?.getPair(accountId.value) : undefined,
                dispatch,
              })
            }
            variant="primary"
          >
            Call
          </Button>
        </Buttons>
      </div>
      <div className="col-span-6 lg:col-span-5 2xl:col-span-4 pl-10 lg:pl-20 w-full">
        <ResultsOutput results={state.results} />
      </div>
    </div>
  );
};
