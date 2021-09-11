import React, { useState, useEffect } from 'react';
import { Dropdown } from '../Dropdown';
import { ArgumentForm } from '../ArgumentForm';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { ResultsOutput } from './ResultsOutput';
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
      <div className="grid grid-cols-12 w-full">
        <div className="col-span-8 rounded-lg w-full">
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
          <Buttons>
            <Button
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
              variant="primary"
            >
              Call
            </Button>
          </Buttons>
        </div>
        <div className="col-span-4 pl-20 w-full">
          <ResultsOutput />
        </div>
      </div>
    )
  );
};
