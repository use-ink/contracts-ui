// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useInstantiate } from 'ui/contexts';
import { SidePanel } from '../common/SidePanel';

export function DryRun() {
  const { dryRunResult } = useInstantiate();

  return <SidePanel header="Predicted Outcome"></SidePanel>;
}
