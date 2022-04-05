// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React from 'react';
import { useNavigate } from 'react-router';
import { Dropdown } from '../common/Dropdown';
import { RPCS } from '../../../constants';
import { useApi } from 'ui/contexts';
import { classes } from 'ui/util';

const options = [
  {
    label: 'Local Node',
    value: RPCS.LOCAL,
  },
  {
    label: 'Canvas',
    value: RPCS.CANVAS,
  },
];

export function NetworkAndUser() {
  const { endpoint, status } = useApi();
  const navigate = useNavigate();

  return (
    <div className="network-and-user">
      <Dropdown
        className={classes(
          'chain',
          status === 'READY' ? 'isConnected' : '',
          status === 'CONNECTING' ? 'isConnecting' : '',
          status === 'ERROR' ? 'isError' : ''
        )}
        onChange={e => {
          navigate(`/?rpc=${e}`);
        }}
        options={options}
        value={options.find(o => o.value === endpoint)?.value || 'ws://127.0.0.1:9944'}
      />
    </div>
  );
}
