// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { LOCAL, LOCAL_STORAGE_KEY } from '../../../constants';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Button } from '../common/Button';
import { Input } from '../form/Input';
import { Setting } from './Setting';
import { isValidWsUrl } from 'helpers';

export function CustomEndpoint() {
  const [customEndpoint, setCustomEndpoint] = useLocalStorage<string>(
    LOCAL_STORAGE_KEY.CUSTOM_ENDPOINT,
    LOCAL.rpc
  );
  const [value, setValue] = useState(customEndpoint);
  const navigate = useNavigate();

  const useNow = useCallback(() => {
    if (isValidWsUrl(value)) {
      setCustomEndpoint(value);
      navigate(`/?rpc=${value}`);
    }
  }, [value, setCustomEndpoint, navigate]);

  return (
    <Setting label="Custom Endpoint" description="Use a custom endpoint for the local nodes">
      <div className="flex flex-row items-center justify-end">
        <Input onChange={setValue} value={value} />
        <Button isDisabled={!isValidWsUrl(value)} onClick={useNow}>
          Use Now
        </Button>
      </div>
    </Setting>
  );
}
