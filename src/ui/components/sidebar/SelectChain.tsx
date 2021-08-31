import React, { useState } from 'react';
import { Dropdown } from '../Dropdown';
import type { DropdownOption } from 'types';
import { useCanvas } from 'ui/contexts';

const options = [
  {
    name: 'Local Node',
    value: 'ws://127.0.0.1:9944'
  }
]

export function SelectChain () {
  const { endpoint } = useCanvas();
  const [value] = useState<DropdownOption>(options.find(({ value }) => value === endpoint) || options[0]);

  return (
    <Dropdown
      className="chain"
      // onChange={({ value: { value } }) => setEndpoint(value)}
      onChange={() => {}}
      options={options}
      value={value}
    />
  )
}