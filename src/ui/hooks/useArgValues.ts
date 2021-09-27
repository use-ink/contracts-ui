import React, { useEffect, useState } from 'react';
import { AbiParam, ApiPromise } from 'types';
import { useCanvas } from 'ui/contexts/CanvasContext';
import { getInitValue } from 'ui/util';

type ArgValues = Record<string, unknown>;

function fromArgs (api: ApiPromise, args: AbiParam[]): ArgValues {
  const result: ArgValues = {};

  args.forEach(({ name, type }) => {
    result[name] = getInitValue(api.registry, type);
  })

  return result
}

export function useArgValues (args: AbiParam[]): [ArgValues, React.Dispatch<ArgValues>] {
  const { api } = useCanvas();

  const [value, setValue] = useState(fromArgs(api, args));
  // const argsRef = useRef(args);

  useEffect(
    (): void => {
      if (!(Object.keys(value).length === 0 && args.length === 0)) {
        setValue(fromArgs(api, args));
      }
    },
    [args]
  )

  return [value, setValue];
}