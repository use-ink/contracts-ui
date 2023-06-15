// Copyright 2023 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Abi } from 'types';
import { classes } from 'helpers';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  metadata: Abi;
}

export function Metadata({ metadata, className = '', ...restOfProps }: Props) {
  return (
    <div
      className={classes(
        'grid-cols-2 gap-2 p-3 border dark:bg-elevation-1 dark:border-gray-700 border-gray-200 inline-flex items-center rounded grid text-sm dark:text-white text-gray-900',
        className
      )}
      {...restOfProps}
    >
      <div className="col-span-2">
        <div>Contract Hash</div>
        <div className="dark:text-gray-400 text-gray-500">
          {metadata.info.contract.hash.toHex()}
        </div>
      </div>
      <div>
        <div>Language</div>
        <div className="dark:text-gray-400 text-gray-500">{metadata.info.source.language}</div>
      </div>
      <div>
        <div>Compiler</div>
        <div className="dark:text-gray-400 text-gray-500">{metadata.info.source.compiler}</div>
      </div>
      <div>
        <div>Contract version</div>
        <div className="dark:text-gray-400 text-gray-500">{metadata.info.contract.version}</div>
      </div>
      <div>
        <div>Authors</div>
        <div className="dark:text-gray-400 text-gray-500">{metadata.info.contract.authors}</div>
      </div>
    </div>
  );
}
