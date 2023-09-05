// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { LOCAL, LOCAL_STORAGE_KEY } from '~/config';
import { useLocalStorage } from '~/hooks/use-local-storage';
import { Button } from '~/shared/buttons';
import { Input } from '~/shared/form';
import { isValidWsUrl } from '~/lib/util';

export function CustomEndpoint() {
  const [customEndpoint, setCustomEndpoint] = useLocalStorage<string>(
    LOCAL_STORAGE_KEY.CUSTOM_ENDPOINT,
    LOCAL.rpc,
  );
  const [value, setValue] = useState(customEndpoint);
  const navigate = useNavigate();

  const onApply = useCallback(() => {
    if (isValidWsUrl(value)) {
      setCustomEndpoint(value);
      navigate(`/?rpc=${value}`);
    }
  }, [value, setCustomEndpoint, navigate]);

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex flex-col text-sm">
        <span className="font-semibold">Custom Endpoint</span>
        <span className="text-gray-500 dark:text-gray-400">
          Use a custom endpoint for the local nodes
        </span>
      </div>

      <div className="flex flex-row items-center justify-between">
        <Input className="w-full" onChange={setValue} value={value} />
        <Button isDisabled={!isValidWsUrl(value)} onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}
