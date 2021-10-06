// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useReducer } from 'react';
import { Dropdown } from '../Dropdown';
import { ArgumentForm } from '../ArgumentForm';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { OverlayLoader } from '../OverlayLoader';
import { Input } from '../Input';
import { ResultsOutput } from './ResultsOutput';
import { convertToNumber, createEmptyValues, createOptions } from 'api';
import { useApi } from 'ui/contexts';
import { contractCallReducer } from 'ui/reducers';
import { Abi, DropdownOption, ContractCallParams, AbiMessage, ContractCallState } from 'types';

interface Props {
  abi: Abi;
  contractAddress: string;
  isActive: boolean;
  callFn: ({
    api,
    abi,
    contractAddress,
    message,
    endowment,
    gasLimit,
    argValues,
    keyringPair,
  }: ContractCallParams) => void;
}

const initialState: ContractCallState = {
  isLoading: false,
  isSuccess: false,
  results: [],
};

export const InteractTab = ({ abi, contractAddress, callFn, isActive }: Props) => {
  const { api, keyring } = useApi();
  const options = createOptions(abi.messages, 'message');
  const [selectedMsg, selectMsg] = useState<DropdownOption>(options[0]);
  const [message, setMessage] = useState<AbiMessage>(abi.messages[0]);
  const [argValues, setArgValues] = useState<Record<string, string>>();
  const [state, dispatch] = useReducer(contractCallReducer, initialState);
  const [endowment, setEndowment] = useState('');
  const keyringPairs = keyring?.getPairs();
  const accountsOptions = createOptions(keyringPairs, 'pair');
  const [account, setAccount] = useState<DropdownOption>(accountsOptions[0]);

  useEffect(() => {
    setMessage(abi.findMessage(selectedMsg.value));
  }, [selectedMsg, abi]);

  useEffect(() => {
    if (message && message.args.length > 0) {
      setArgValues(createEmptyValues(message.args));
    }
  }, [message]);

  if (!isActive) return null;

  if (state.isLoading) {
    return <OverlayLoader message="Calling instance..." />;
  }
  return (
    api && (
      <div className="grid grid-cols-12 w-full">
        <div className="col-span-6 lg:col-span-7 2xl:col-span-8 rounded-lg w-full">
          <h2 className="mb-2 text-sm">Call from account</h2>
          <Dropdown
            options={accountsOptions}
            className="mb-4"
            value={account}
            onChange={setAccount}
          >
            No accounts found
          </Dropdown>
          <h2 className="mb-2 text-sm">Message to send</h2>
          <div className="flex">
            <div className="mb-4 flex-1">
              <Dropdown options={options} onChange={selectMsg} value={selectedMsg}>
                No messages found
              </Dropdown>
            </div>
            {argValues && (
              <div className="text-sm mb-4 flex-1 ml-2">
                <ArgumentForm
                  key={`args-${message?.identifier}`}
                  args={message?.args}
                  argValues={argValues}
                  handleChange={e =>
                    setArgValues({ ...argValues, [e.target.name]: e.target.value.trim() })
                  }
                />
              </div>
            )}
          </div>

          {message.isPayable && (
            <>
              <h2 className="mb-2 text-sm">Payment</h2>
              <Input
                value={endowment}
                handleChange={e => setEndowment(e.target.value)}
                placeholder="Endowment"
              />
            </>
          )}
          <Buttons>
            <Button
              onClick={() =>
                callFn({
                  api,
                  abi,
                  contractAddress,
                  endowment: convertToNumber(endowment.trim()),
                  gasLimit: 155852802980,
                  argValues,
                  message,
                  keyringPair: keyring?.getPair(account.value.toString()),
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
    )
  );
};
