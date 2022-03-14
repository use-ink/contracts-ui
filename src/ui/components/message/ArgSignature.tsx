import React from 'react';
import { encodeTypeDef } from '@polkadot/types/create';
import { useApi } from 'ui/contexts/ApiContext';
import { TypeDef } from 'types';
import { classes } from 'ui/util';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  arg: { name?: string; type: TypeDef };
  value?: string;
}

const MAX_PARAM_LENGTH = 20;

function truncate(param: string): string {
  return param.length > MAX_PARAM_LENGTH
    ? `${param.substring(0, MAX_PARAM_LENGTH / 2)}…${param.substring(
        param.length - MAX_PARAM_LENGTH / 2
      )}`
    : param;
}

export function ArgSignature({ arg: { name, type }, children, className, value, ...props }: Props) {
  const { api } = useApi();

  return (
    <span className={classes('font-mono', className)} {...props}>
      {name ? `${name}: ` : ''}
      <span>
        {value ? <b>{truncate(value)}</b> : type.typeName || encodeTypeDef(api.registry, type)}
      </span>
      {children}
    </span>
  );
}
