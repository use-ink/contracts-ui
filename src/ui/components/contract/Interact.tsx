import React, { useState, useEffect } from 'react';
import { Dropdown } from '../Dropdown';
import { ArgumentForm } from '../ArgumentForm';
import { createEmptyValues, createOptions } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { Abi, AnyJson, DropdownOption, ContractCallParams, AbiMessage } from 'types';

interface Props {
  metadata: AnyJson;
  contractAddress: string;
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

export const Interact = ({ metadata, contractAddress, callFn }: Props) => {
  const { api, keyring } = useCanvas();
  const [abi] = useState<Abi>(new Abi(metadata));
  const options = createOptions(abi.messages, 'message');
  const [selectedMsg, selectMsg] = useState<DropdownOption>(options[0]);
  const [message, setMessage] = useState<AbiMessage>(abi.messages[0]);
  const [argValues, setArgValues] = useState<Record<string, string>>();

  useEffect(() => {
    setMessage(abi.findMessage(selectedMsg.value));
  }, [selectedMsg, abi]);

  useEffect(() => {
    if (message && message.args.length > 0) {
      setArgValues(createEmptyValues(message.args));
    }
  }, [message]);
  return (
    api && (
      <>
        <div className="rounded-lg">
          <h2 className="mb-2 text-sm">Message to send</h2>
          <div className="mb-4">
            <Dropdown
              options={options}
              placeholder="No messages found"
              changeHandler={(o: DropdownOption) => selectMsg(o)}
              selectedOption={selectedMsg}
            />
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
          <button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-600 text-gray-100 font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              message &&
              callFn({
                api,
                abi,
                contractAddress,
                endowment: 0,
                gasLimit: 155852802980,
                argValues,
                message,
                keyringPair: keyring?.getPair('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'),
              })
            }
          >
            Call
          </button>
        </div>
      </>
    )
  );
};
