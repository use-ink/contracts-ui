// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router';
import { Dropdown } from '../common/Dropdown';
import { RPC } from '../../../constants';
import { useApi } from 'ui/contexts';
import { classes } from 'ui/util';

const options = [
  {
    label: 'Contracts (Rococo)',
    value: RPC.CONTRACTS,
  },
  {
    label: 'Shibuya',
    value: RPC.SHIBUYA,
  },
  {
    label: 'Shiden',
    value: RPC.SHIDEN,
  },
  {
    label: 'Local Node',
    value: RPC.LOCAL,
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
        value={options.find(o => o.value === endpoint)?.value || RPC.CONTRACTS}
      />
    </div>
  );
}
