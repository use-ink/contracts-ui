// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { useApi } from 'ui/contexts/ApiContext';
import { AbiParam, Account, Registry, SetState } from 'types';
import { getInitValue } from 'helpers';

type ArgValues = Record<string, unknown>;

function fromArgs(registry: Registry, accounts: Account[], args: AbiParam[] | null): ArgValues {
  const result: ArgValues = {};

  (args || []).forEach(({ name, type }) => {
    result[name] = getInitValue(registry, accounts, type);
  });

  return result;
}

export function useArgValues(
  args: AbiParam[],
  registry?: Registry
): [ArgValues, SetState<ArgValues>] {
  const { accounts } = useApi();
  const [value, setValue] = useState<ArgValues>(
    accounts && registry ? fromArgs(registry, accounts, args) : {}
  );
  const argsRef = useRef(args);

  useEffect((): void => {
    if (accounts && argsRef.current !== args) {
      registry && setValue(fromArgs(registry, accounts, args));
      argsRef.current = args;
    }
  }, [accounts, args, registry]);

  return [value, setValue];
}
