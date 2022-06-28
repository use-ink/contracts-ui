// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { useApi } from 'ui/contexts/ApiContext';
import { AbiParam, Keyring, Registry, SetState } from 'types';
import { getInitValue } from 'ui/util';

type ArgValues = Record<string, unknown>;

function fromArgs(registry: Registry, keyring: Keyring, args: AbiParam[] | null): ArgValues {
  const result: ArgValues = {};

  (args || []).forEach(({ name, type }) => {
    result[name] = getInitValue(registry, keyring, type);
  });

  return result;
}

export function useArgValues(
  registry: Registry,
  args: AbiParam[] | null
): [ArgValues, SetState<ArgValues>] {
  const { keyring } = useApi();
  const [value, setValue] = useState<ArgValues>(fromArgs(registry, keyring, args));
  const argsRef = useRef(args);

  useEffect((): void => {
    if (argsRef.current !== args) {
      setValue(fromArgs(registry, keyring, args));
      argsRef.current = args;
    }
  }, [registry, keyring, args]);

  return [value, setValue];
}
