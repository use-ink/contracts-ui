import { useEffect, useRef, useState } from 'react';
import { AbiParam, ApiPromise, Keyring, SetState } from 'types';
import { useCanvas } from 'ui/contexts/CanvasContext';
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
  const { api, keyring } = useCanvas();

  const [value, setValue] = useState<ArgValues>(fromArgs(api, keyring, args));
  const argsRef = useRef(args);

  useEffect((): void => {
    if (argsRef.current !== args && !(argsRef.current.length === 0 && args.length === 0)) {
      setValue(fromArgs(api, keyring, args));
      argsRef.current = args;
    }
  }, [args, api, keyring]);

  return [value, setValue];
}
