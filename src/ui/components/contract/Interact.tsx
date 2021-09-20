import React, { useState, useEffect } from 'react';
import { Dropdown } from '../Dropdown';
import { ArgumentForm } from '../ArgumentForm';
import { Button } from '../Button';
import { Buttons } from '../Buttons';
import { createEmptyValues, createMessageOptions } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { Abi, AnyJson, ContractCallParams, AbiMessage } from 'types';

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
  const options = createMessageOptions(abi.messages);
  const [message, setMessage] = useState<AbiMessage>(abi.messages[0]);
  const [argValues, setArgValues] = useState<Record<string, string>>();

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
              onChange={setMessage}
              value={message}
            >
              No messages found
            </Dropdown>
          </div>
          {argValues && (
            <div className="text-sm mb-4">
              <ArgumentForm
                key={`args-${message?.method}`}
                args={message?.args}
                argValues={argValues}
                onChange={e =>
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
      </>
    )
  );
};
