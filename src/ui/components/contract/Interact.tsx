import React, { useState, useEffect } from 'react';
import { Dropdown } from '../Dropdown';
import { ArgumentForm } from '../ArgumentForm';
import { createEmptyValues } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { Abi, AnyJson, DropdownOption, ContractCallParams } from 'types';

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
  const [selectedMsg, selectMsg] = useState<DropdownOption>();
  const [argValues, setArgValues] = useState<Record<string, string>>();
  const abi = new Abi(metadata);
  const message = abi.findMessage(selectedMsg ? selectedMsg.value : 0);
  const messageOptions = abi.messages.map(m => ({
    name: `${m.identifier}() ${m.returnType ? `: ${m.returnType?.type}` : ''}`,
    value: m.index,
  }));

  useEffect(() => {
    messageOptions && selectMsg(messageOptions[0]);
  }, []);

  useEffect(() => {
    setArgValues(createEmptyValues(abi?.findMessage(0).args));
  }, []);
  return (
    api && (
      <>
        <div className="rounded-lg">
          <h2 className="mb-2 text-sm">Message to send</h2>
          <div className="mb-4">
            <Dropdown
              options={messageOptions}
              placeholder="No messages found"
              changeHandler={(o: DropdownOption) => selectMsg(o)}
              selectedOption={selectedMsg}
            />
          </div>
          {message && (
            <div className="text-sm mb-4">
              <>
                {message.args && (
                  <ArgumentForm
                    key={`args-${message.identifier}`}
                    args={message.args}
                    handleChange={e =>
                      setArgValues({ ...argValues, [e.target.name]: e.target.value.trim() })
                    }
                  />
                )}
                <button
                  type="button"
                  className="bg-indigo-500 hover:bg-indigo-600 text-gray-100 font-bold py-2 px-4 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
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
              </>
            </div>
          )}
        </div>
      </>
    )
  );
};
