import React, { useState, useEffect } from 'react';
import { Dropdown } from '../Dropdown';
import { ArgumentForm } from '../ArgumentForm';
import { call, createEmptyValues } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { ContractPromise, DropdownOption } from 'types';

interface Props {
  contract: ContractPromise | null;
}

export const Interact = ({ contract }: Props) => {
  const { keyring, api } = useCanvas();
  const [selectedMsg, selectMsg] = useState<DropdownOption>();
  const [argValues, setArgValues] = useState<Record<string, string>>();
  const keyringPair = keyring?.getPairs()[0];
  const message = contract ? contract.abi.findMessage(selectedMsg ? selectedMsg.value : 0) : null;
  const messageOptions = contract?.abi.messages.map(m => ({
    name: `${m.identifier}() ${m.returnType ? `: ${m.returnType?.type}` : ''}`,
    value: m.index,
  }));

  useEffect(() => {
    messageOptions && selectMsg(messageOptions[0]);
  }, []);

  useEffect(() => {
    contract && setArgValues(createEmptyValues(contract.abi.findMessage(0).args));
  }, []);
  return (
    api &&
    keyring &&
    contract && (
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
                  onClick={() => call(contract, 0, 155852802980, message, argValues, keyringPair)}
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
