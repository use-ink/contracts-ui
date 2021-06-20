import React from 'react';
import type { AbiMessage } from '../types';

interface Props {
  message?: Partial<AbiMessage>;
  argValues?: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ArgumentForm = ({ message, handleChange, argValues }: Props) => {
  return message && message.args && argValues ? (
    <>
      {message.args.map(({ name, type }) => {
        return (
          <div className="mb-4" key={`${name}`}>
            <input
              type="text"
              name={`${name}`}
              id={`${name}`}
              placeholder={`${name}: <${type.type}>`}
              value={argValues ? argValues[`${name}`] : ''}
              onChange={handleChange}
              className="w-full bg-white border-gray-300"
            />
          </div>
        );
      })}
    </>
  ) : null;
};

export default ArgumentForm;
