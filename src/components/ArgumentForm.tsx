import React, { useState } from 'react';
import type { AbiMessage } from '../types';

interface Props {
  message?: AbiMessage;
}
const useArgumentForm = () => {
  const [argValues, setArgValues] = useState<Record<string, string>>();
  const ArgumentForm = ({ message }: Props) => {
    function handleArgValueChange(e: React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
      setArgValues({ ...argValues, [e.target.name]: e.target.value.trim() });
    }

    return (
      message &&
      message.args && (
        <>
          {message.args.map(({ name, type }) => {
            return (
              <div className="mb-4" key={`${name}`}>
                <input
                  type="text"
                  name={`${name}`}
                  id={`${name}`}
                  placeholder={`${name}: <${type.displayName}>`}
                  value={argValues ? argValues[`${name}`] : ''}
                  onChange={handleArgValueChange}
                  className="w-full bg-white border-gray-300"
                />
              </div>
            );
          })}
        </>
      )
    );
  };
  return [argValues, ArgumentForm, setArgValues] as [
    Record<string, string>,
    (props: Props) => JSX.Element,
    React.Dispatch<React.SetStateAction<Record<string, string> | undefined>>
  ];
};

export default useArgumentForm;
