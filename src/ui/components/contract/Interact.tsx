import React, { useState, useEffect } from 'react';
import { Dropdown } from '../Dropdown';
import { ArgumentForm } from '../ArgumentForm';
import { createEmptyValues } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { Abi, AnyJson, ApiPromise, DropdownOption, KeyringPair, AbiMessage } from 'types';

interface Props {
  metadata: AnyJson;
  address: string;
  keyringPairs: Partial<KeyringPair>[] | null;
  callFn: (
    api: ApiPromise,
    abi: Abi,
    address: string,
    endowment: number,
    gasLimit: number,
    message: AbiMessage,
    fromAddress: string,
    argValues?: Record<string, string>
  ) => void;
}

export const Interact = ({ metadata, address, keyringPairs, callFn }: Props) => {
  const { api } = useCanvas();
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
    api &&
    keyringPairs && (
      <>
        <div className="rounded-lg">
          <h2 className="mb-2 text-sm">Message to send</h2>
          <div className="mb-4">
            <Dropdown
              options={messageOptions}
              placeholder="No messages found"
              onChange={(o: DropdownOption) => selectMsg(o)}
              value={selectedMsg}
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
                    callFn(
                      api,
                      abi,
                      address,
                      0,
                      155852802980,
                      message,
                      keyringPairs[0].address || '',
                      argValues
                    )
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
