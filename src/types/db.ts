// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Database, CodeBundleDocument, ContractDocument } from 'db';

export type { CodeBundleDocument, ContractDocument, Database };

export interface DbState {
  db: Database;
}
