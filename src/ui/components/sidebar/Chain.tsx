import React, { useState } from 'react';
import { Dropdown } from '../Dropdown';
import type { DropdownOption, OptionProps } from 'types';
import { useCanvas } from 'ui/contexts';

const options = [
  {
    name: 'Local Node',
    value: 'ws://127.0.0.1:9944'
  }
]

function Option ({ value: { name } }: OptionProps): React.ReactElement<OptionProps> {
  return (
    <div className="flex items-center text-xs">
      <div className="rounded-full w-1.5 h-1.5 mr-1 bg-green-400" />
      {name}
    </div>
  )
}

export function Chain () {
  const { endpoint } = useCanvas();
  const [value] = useState<DropdownOption>(options.find(({ value }) => value === endpoint) || options[0]);

  // const onChange = useCallback(
  //   ({ value: { value } }: DropdownOption) => {
  //     setEndpoint(value);
  //   },
  //   []
  // )

  return (
    <Dropdown
      // onChange={({ value: { value } }) => setEndpoint(value)}
      onChange={() => {}}
      options={options}
      optionView={Option}
      value={value}
    />
  )
}