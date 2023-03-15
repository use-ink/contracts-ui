// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { Input } from 'ui/components';
import { RPC } from '../../../constants';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Setting } from './Setting';

export function CustomEndpoint() {
  const [customEndpoint, setCustomEndpoint] = useLocalStorage<string>(
    'contractsUiCustomEndpoint',
    RPC.LOCAL
  );

  const [value, setValue] = useState(customEndpoint);

  return (
    <Setting label="Custom Endpoint" description="Use a custom endpoint for the local nodes">
      <Input onChange={setValue} value={value} />
    </Setting>
  );
}
