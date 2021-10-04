import React, { useState, useEffect, useReducer } from 'react';
import { Dropdown } from '../Dropdown';
import { ArgumentForm } from '../ArgumentForm';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { OverlayLoader } from '../OverlayLoader';
import { Input } from '../Input';
import { AccountSelect } from '../AccountSelect';
import { ResultsOutput } from './ResultsOutput';
import { convertToNumber, createEmptyValues } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { contractCallReducer } from 'ui/reducers';
import { Abi, ContractCallParams, AbiMessage, ContractCallState } from 'types';
import { useAccountId } from 'ui/hooks/useAccountId';

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
  const options = abi.messages.map((message) => {
    return {
      name: message.method,
      value: message
    }
  });

  const { api, keyring } = useCanvas();
  const { value: accountId, onChange: setAccountId } = useAccountId();
  const [message, setMessage] = useState<AbiMessage>(options[0].value);
  const [argValues, setArgValues] = useState<Record<string, string>>();
  const [state, dispatch] = useReducer(contractCallReducer, initialState);
  const [endowment, setEndowment] = useState('');

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
          <AccountSelect
            value={accountId}
            onChange={setAccountId}
          />
          <h2 className="mb-2 text-sm">Message to send</h2>
          <div className="flex">
            <div className="mb-4 flex-1">
              <Dropdown
                options={options}
                onChange={setMessage}
                value={message}
              >
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
                  keyringPair: accountId ? keyring?.getPair(accountId) : undefined,
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
