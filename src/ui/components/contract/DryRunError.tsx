// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { OutcomeItem } from './OutcomeItem';
import { RegistryError } from 'types';

export function DryRunError({ error }: { error: RegistryError }) {
  return (
    <div className="mb-1 break-normal  text-xs">
      <OutcomeItem title="DispatchError" displayValue={error.name} key="outcome-err-name" />
      <OutcomeItem
        title="DispatchError docs"
        displayValue={error?.docs.join('\r\n')}
        key="outcome-err-docs"
      />
    </div>
  );
}
