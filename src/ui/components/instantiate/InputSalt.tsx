import React from 'react';
import { Switch } from '../Switch';
import { Input } from '../Input';
import { useInstantiate } from 'ui/contexts';

// interface Props {
//   onChange: (_: string) => void;
//   value: string;
// }

export function InputSalt () {
  const {
    isUsingSalt: [isUsingSalt, toggleIsUsingSalt],
    salt,
  } = useInstantiate();

  return (
    <div className="flex items-center">
      <Input
        className="flex-1"
        id="salt"
        isDisabled={!isUsingSalt}
        isError={salt.isError}
        value={isUsingSalt ? salt.value : ''}
        onChange={salt.onChange}
        placeholder={isUsingSalt ? "0x" : 'Do not use'}
      />
      <div className="flex justify-center items-center w-18">
        <Switch
          value={isUsingSalt}
          onChange={toggleIsUsingSalt}
        />
      </div>
    </div>

  )
}