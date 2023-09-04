// Copyright 2023 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { classes } from 'lib/util';
import { Abi } from 'types';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  metadata: Abi;
}

export function Metadata({ metadata, className = '', ...restOfProps }: Props) {
  return (
    <div
      className={classes(
        'inline-flex grid grid-cols-2 items-center gap-2 rounded border border-gray-200 p-3 text-sm text-gray-900 dark:border-gray-700 dark:bg-elevation-1 dark:text-white',
        className,
      )}
      {...restOfProps}
    >
      <div className="col-span-2">
        <div>Contract Hash</div>
        <div className="text-gray-500 dark:text-gray-400">
          {metadata.info.contract.hash.toHex()}
        </div>
      </div>
      <div>
        <div>Language</div>
        <div className="text-gray-500 dark:text-gray-400">{metadata.info.source.language}</div>
      </div>
      <div>
        <div>Compiler</div>
        <div className="text-gray-500 dark:text-gray-400">{metadata.info.source.compiler}</div>
      </div>
      <div>
        <div>Contract version</div>
        <div className="text-gray-500 dark:text-gray-400">{metadata.info.contract.version}</div>
      </div>
      <div>
        <div>Authors</div>
        <div className="text-gray-500 dark:text-gray-400">{metadata.info.contract.authors}</div>
      </div>
    </div>
  );
}
