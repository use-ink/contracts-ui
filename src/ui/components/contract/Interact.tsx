import React, { useState, useEffect, useReducer, Reducer, useMemo } from 'react';
import { Dropdown } from '../Dropdown';
import { ArgumentForm } from '../ArgumentForm';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { Input } from '../Input';
import { ResultsOutput } from './ResultsOutput';
import { convertToNumber, createEmptyValues, createOptions } from 'canvas';
import { useCanvas } from 'ui/contexts';
import {
  Abi,
  AnyJson,
  DropdownOption,
  ContractCallParams,
  AbiMessage,
  ContractCallState,
  ContractCallAction,
} from 'types';

interface Props {
  metadata: AnyJson;
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

const reducer: Reducer<ContractCallState, ContractCallAction> = (state, action) => {
  switch (action.type) {
    case 'CALL_INIT':
      return { ...state, isLoading: true };
    case 'CALL_SUCCESS':
      return {
        ...state,
        isSuccess: true,
        results: [
          ...state.results,
          {
            data: action.payload.data,
            method: action.payload.method,
            returnType: action.payload.returnType,
            time: action.payload.time,
            isMutating: action.payload.isMutating,
            isPayable: action.payload.isPayable,
            blockHash: action.payload.blockHash,
            info: action.payload.info,
          },
        ],
        isLoading: false,
      };
    case 'CALL_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    default:
      throw new Error();
  }
};

export const InteractTab = ({ metadata, contractAddress, callFn, isActive }: Props) => {
  const { api, keyring } = useCanvas();
  const [abi] = useState<Abi>(new Abi(metadata));
  const options = createOptions(abi.messages, 'message');
  const [selectedMsg, selectMsg] = useState<DropdownOption>(options[0]);
  const [message, setMessage] = useState<AbiMessage>(abi.messages[0]);
  const [argValues, setArgValues] = useState<Record<string, string>>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [endowment, setEndowment] = useState('');
  const keyringPairs = keyring?.getPairs();
  const accountsOptions = useMemo((): DropdownOption[] => createOptions(keyringPairs, 'pair'), []);
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
    return (
      <div className="w-full h-full fixed flex top-0 left-0 bg-gray-900 opacity-75 z-50">
        <div className="m-auto flex flex-col justify-center items-center">
          <div
            style={{ borderTopColor: 'transparent' }}
            className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin mb-4"
          ></div>
          <div> Calling instance...</div>
        </div>
      </div>
    );
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
          <div className="mb-4">
            <Dropdown
              options={options}
              onChange={(o: DropdownOption) => selectMsg(o)}
              value={selectedMsg}
            >
              No messages found
            </Dropdown>
          </div>
          {argValues && (
            <div className="text-sm mb-4">
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
                message &&
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
