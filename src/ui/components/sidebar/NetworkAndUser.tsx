// Copyright 2021 @paritytech/canvas-ui authors & contributors

import React, { useState } from 'react';
import { Button } from '../Button';
import { Dropdown } from '../Dropdown';
import { useDatabase , useCanvas } from 'ui/contexts';
import type { DropdownOption } from 'types';
import { classes } from 'ui/util';

const options = [
  {
    name: 'Local Node',
    value: 'ws://127.0.0.1:9944'
  }
]

export function NetworkAndUser () {
  const { endpoint, status } = useCanvas();
  const { user } = useDatabase();
  const [chain] = useState<DropdownOption>(options.find(({ value }) => value === endpoint) || options[0]);

  return (
    <div className='network-and-user'>
      <Dropdown
        className={
          classes(
            'chain',
            status === 'READY' ? 'isConnected' : '',
            status === 'CONNECTING' ? 'isConnecting' : '',
            status === 'ERROR' ? 'isError' : ''
          )
        }
        onChange={() => {}}
        options={options}
        value={chain}
      />
      {!user?.creator && (
        <Button
          className='connect-account'
          variant='primary'
        >
          Connect Account
        </Button>
      )}
    </div>
  )
}