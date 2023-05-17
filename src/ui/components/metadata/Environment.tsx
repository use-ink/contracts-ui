// Copyright 2023 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { classes } from 'helpers';
import { useMemo } from 'react';
import { Abi } from 'types';
import { useApi } from '../../contexts/ApiContext';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  metadata: Abi;
}

interface EnvironmentValue<T extends string> {
  displayName: [T];
  type: number;
}

const isEnvironmentValue = (value: unknown): value is EnvironmentValue<string> => {
  if (typeof value !== 'object') return false;
  if ('displayName' in (value as object)) {
    return true;
  }
  return false;
};

interface ContractEnvironment {
  accountId: EnvironmentValue<'AccountId'>;
  balance: EnvironmentValue<'Balance'>;
  blockNumber: EnvironmentValue<'BlockNumber'>;
  chainExtension: EnvironmentValue<'ChainExtension'>;
  hash: EnvironmentValue<'Hash'>;
  maxEventTopics: number;
  timestamp: EnvironmentValue<'Timestamp'>;
}

export function Environment({ metadata, className = '', ...restOfProps }: Props) {
  const { api } = useApi();

  const environment = useMemo(() => {
    if (
      !metadata.json['spec'] ||
      !(metadata.json['spec'] as Record<string, unknown>)['environment']
    )
      return undefined;
    return (metadata.json['spec'] as Record<string, unknown>)['environment'] as ContractEnvironment;
  }, [metadata]);

  const isCompatible = useMemo(() => {
    if (!environment || !api) return undefined;

    Object.entries(environment).forEach(([key, value]) => {
      if (isEnvironmentValue(value)) {
        try {
          const abiTypeCreateType = metadata.registry.createType(value.displayName[0]);
          const abiType = metadata.registry.lookup.getTypeDef(value.type).type;
          const chainType = api.registry.createType(value.displayName[0]);
          metadata.json;
          console.log({
            displayName: value.displayName[0],
            abiType: abiType,
            abiTypeCreateType: abiTypeCreateType.toRawType(),
            chainType: chainType.toRawType(),
            primitive: chainType.toPrimitive(),
          });
        } catch (exception) {
          console.log(`Unable to create type ${value.displayName[0]}`);
        }
      }
    });
  }, [api, environment]);

  return (
    <div
      className={classes(
        'grid-cols-2 gap-2 p-3 border dark:bg-elevation-1 dark:border-gray-700 border-gray-200 inline-flex items-center rounded grid text-sm dark:text-white text-gray-900',
        className
      )}
      {...restOfProps}
    >
      Environment
    </div>
  );
}
