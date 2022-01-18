// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Dropdown } from '../common/Dropdown';
import { ENDPOINT } from '../../../constants';
import { useApi } from 'ui/contexts';
import { classes } from 'ui/util';

const options = [
  {
    name: 'Local Node',
    value: ENDPOINT.LOCAL,
  },
  {
    name: 'Canvas',
    value: ENDPOINT.CANVAS,
  },
];

export function NetworkAndUser() {
  const { endpoint, status, setEndpoint } = useApi();

  return (
    <div className="network-and-user">
      <Dropdown
        className={classes(
          'chain',
          status === 'READY' ? 'isConnected' : '',
          status === 'CONNECTING' ? 'isConnecting' : '',
          status === 'ERROR' ? 'isError' : ''
        )}
        onChange={setEndpoint}
        options={options}
        value={options.find(o => o.value === endpoint)?.value || ENDPOINT.LOCAL}
      />
    </div>
  );
}
