// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useApi } from 'ui/contexts/ApiContext';
import { AbiParam, ApiPromise, Keyring, SetState } from 'types';
import { getInitValue } from 'ui/util';

type ArgValues = Record<string, unknown>;

function fromArgs(api: ApiPromise, keyring: Keyring, args: AbiParam[]): ArgValues {
  const result: ArgValues = {};

  args.forEach(({ name, type }) => {
    result[name] = getInitValue(api.registry, keyring, type);
  });

  return result;
}

export function useArgValues(args: AbiParam[]): [ArgValues, SetState<ArgValues>] {
  const { api, keyring } = useApi();
  const [value, setValue] = useState<ArgValues>(fromArgs(api, keyring, args));

  useEffect((): void => {
    setValue(fromArgs(api, keyring, args));
  }, [api, keyring, args]);

  return [value, setValue];
}
