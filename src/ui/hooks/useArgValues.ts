import React, { useState } from 'react';
import { AbiParam, ApiPromise } from 'types';
import { useCanvas } from 'ui/contexts/CanvasContext';
import { getInitValue } from 'ui/util';

type ArgValues = Record<string, unknown>;

function fromArgs (args: AbiParam[], api: ApiPromise): ArgValues {
  const result: ArgValues = {};

  args.forEach(({ name, type }) => {
    result[name] = getInitValue(api!.registry, type);
  })

  return result
}

export function useArgValues (args: AbiParam[]): [ArgValues, React.Dispatch<ArgValues>] {
  const { api } = useCanvas();

  const [value, setValue] = useState(fromArgs(args, api!));

  return [value, setValue];
}