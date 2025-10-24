// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNavigate } from 'react-router';

import { TESTNETS_V5, TESTNETS_V6, MAINNETS_V5, MAINNETS_V6 } from '../../../constants';
import { useApi, useVersion } from 'ui/contexts';
import { classes } from 'lib/util';
import { Dropdown } from 'ui/components';

export function NetworkAndUser() {
  const { endpoint, status } = useApi();
  const { version } = useVersion();
  const navigate = useNavigate();

  const testnets = version === 'v6' ? TESTNETS_V6 : TESTNETS_V5;
  const testnetOptions = testnets.map(network => ({ label: network.name, value: network.rpc }));
  const mainnets = version === 'v6' ? MAINNETS_V6 : MAINNETS_V5;
  const mainnetOptions = mainnets.map(network => ({ label: network.name, value: network.rpc }));
  const allOptions = [...testnetOptions, ...mainnetOptions];

  const dropdownOptions = [
    ...(mainnetOptions.length ? [{ label: 'Live Networks', options: mainnetOptions }] : []),
    { label: 'Test Networks', options: testnetOptions },
  ];

  return (
    <div className="network-and-user">
      <Dropdown
        className={classes(
          'chain',
          status === 'connected' ? 'isConnected' : '',
          status === 'loading' ? 'isConnecting' : '',
          status === 'error' ? 'isError' : '',
        )}
        onChange={e => {
          navigate(`/?rpc=${e}`);
        }}
        options={dropdownOptions}
        value={allOptions.find(o => o.value === endpoint)?.value || allOptions[0].value}
      />
    </div>
  );
}
