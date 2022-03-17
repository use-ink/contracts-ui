// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getCodeBundleCollection, getContractCollection } from './util';
// import { findTopCodeBundles } from "./codeBundle";
import type { Database, DbStatistics } from 'types';

export async function getStatistics(db: Database): Promise<DbStatistics> {
  const codeBundles = await getCodeBundleCollection(db).find({}).toArray();
  const contractsCount = (await getContractCollection(db).find({}).toArray()).length;

  return { codeBundlesCount: codeBundles.length, contractsCount, mostPopularCodeBundles: [] };
}
