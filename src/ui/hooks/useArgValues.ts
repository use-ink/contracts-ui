// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { useApi } from 'ui/contexts/ApiContext';
import { AbiParam, Account, Registry, SetState } from 'types';
import { getInitValue } from 'ui/util';

type ArgValues = Record<string, unknown>;

function fromArgs(registry: Registry, accounts: Account[], args: AbiParam[] | null): ArgValues {
  const result: ArgValues = {};

  (args || []).forEach(({ name, type }) => {
    result[name] = getInitValue(registry, accounts, type);
  });

  return result;
}

export function useArgValues(args: AbiParam[] | null): [ArgValues, SetState<ArgValues>] {
  const { accounts, api } = useApi();
  const [value, setValue] = useState<ArgValues>(
    accounts && api ? fromArgs(api.registry, accounts, args) : {}
  );
  const argsRef = useRef(args);

  useEffect((): void => {
    if (api && accounts && argsRef.current !== args) {
      setValue(fromArgs(api.registry, accounts, args));
      argsRef.current = args;
    }
  }, [accounts, args, api]);

  return [value, setValue];
}
