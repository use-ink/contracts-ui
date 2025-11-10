// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useMemo, useRef, useState } from 'react';
import { useApi, useVersion } from 'ui/contexts';
import { AbiMessage, AbiParam, Account, Registry, SetState } from 'types';
import { getInitValue } from 'lib/initValue';
import { transformUserInput } from 'lib/callOptions';
import type { InkVersion } from 'ui/contexts/VersionContext';

type ArgValues = Record<string, unknown>;

function fromArgs(
  registry: Registry,
  accounts: Account[],
  args: AbiParam[],
  version?: InkVersion,
): ArgValues {
  const result: ArgValues = {};

  args?.forEach(({ name, type }) => {
    result[name] = getInitValue(registry, accounts, type, version);
  });

  return result;
}

export function useArgValues(
  message: AbiMessage | undefined,
  registry: Registry,
): [ArgValues, SetState<ArgValues>, Uint8Array | undefined] {
  const { accounts } = useApi();
  const { version } = useVersion();
  const [value, setValue] = useState<ArgValues>(
    accounts && message ? fromArgs(registry, accounts, message.args, version) : {},
  );
  const argsRef = useRef(message?.args ?? []);

  const inputData = useMemo(() => {
    let data: Uint8Array | undefined;
    try {
      // WORKAROUND: ink v6 Address/H160 encoding - patch args for dry run calls
      if (version === 'v6' && message) {
        const patchedArgs = message.args.map(arg => {
          if (arg.type.type === 'Address') {
            return { ...arg, type: { ...arg.type, type: 'H160' } };
          }
          return arg;
        });

        const patchedMessage = { ...message, args: patchedArgs };
        data = patchedMessage.toU8a(transformUserInput(registry, patchedArgs, value));
      } else {
        data = message?.toU8a(transformUserInput(registry, message.args, value));
      }
    } catch (e) {
      console.error(e);
    }
    return data;
  }, [value, registry, message, version]);

  useEffect((): void => {
    if (accounts && message && argsRef.current !== message.args) {
      setValue(fromArgs(registry, accounts, message.args, version));
      argsRef.current = message.args;
    }
  }, [accounts, message, registry, version]);

  return [value, setValue, inputData];
}
