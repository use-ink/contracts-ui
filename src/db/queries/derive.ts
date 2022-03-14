import { getCodeBundleCollection, getContractCollection } from './util';
// import { findTopCodeBundles } from "./codeBundle";
import type { Database, DbStatistics } from 'types';

export async function getStatistics(db: Database): Promise<DbStatistics> {
  const codeBundles = await getCodeBundleCollection(db).find({}).toArray();
  const contractsCount = (await getContractCollection(db).find({}).toArray()).length;

  return { codeBundlesCount: codeBundles.length, contractsCount, mostPopularCodeBundles: [] };
}
