// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router';
import { Dropdown } from '../common/Dropdown';
import { RPC } from '../../../constants';
import { useApi } from 'ui/contexts';
import { classes } from 'helpers';

const data = [
  {
    label: 'Test Networks',
    options: [
      {
        label: 'Aleph Zero',
        value: RPC.ALEPHZEROTESTNET,
      },
      {
        label: 'Pendulum',
        value: RPC.PENDULAM,
      },
      {
        label: 'Phala',
        value: RPC.PHALA,
      },
      {
        label: 'Peaq network',
        value: RPC.PEAQ,
      },
      {
        label: 'Shibuya',
        value: RPC.SHIDEN,
      },
      {
        label: 't3rn',
        value: RPC.T3RN,
      },
    ],
  },
  {
    label: 'Production Networks',
    options: [
      {
        label: 'Shiden',
        value: RPC.SHIBUYA,
      },
    ],
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
          status === 'connected' ? 'isConnected' : '',
          status === 'loading' ? 'isConnecting' : '',
          status === 'error' ? 'isError' : ''
        )}
        onChange={e => {
          navigate(`/?rpc=${e}`);
        }}
        options={data}
        value={endpoint}
      />
    </div>
  );
}
