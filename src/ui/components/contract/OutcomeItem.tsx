// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CopyButton } from 'ui/components/common/CopyButton';

export function OutcomeItem({
  displayValue,
  copyValue = JSON.stringify(displayValue),
  title,
}: {
  title: string;
  displayValue: string;
  copyValue?: string;
}): JSX.Element {
  return (
    <div className="mb-4 event-log">
      <div className="mb-1 leading-5">{title}</div>
      <div
        className="dark:bg-elevation-1 bg-gray-200 p-2 rounded-sm text-xs return-value dark:text-gray-400 text-gray-600  break-all relative"
        data-cy="output"
      >
        <pre className="whitespace-pre-wrap">{displayValue}</pre>
        <CopyButton className="absolute right-2 bottom-2" value={copyValue} />
      </div>
    </div>
  );
}
