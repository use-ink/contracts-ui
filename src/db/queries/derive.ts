import { getCodeBundleCollection, getContractCollection } from "./util";
import { findTopCodeBundles } from "./codeBundle";
import type { Database, DbStatistics } from 'types';

export async function getStatistics (db: Database): Promise<DbStatistics> {
  try {
    const codeBundles = (await getCodeBundleCollection(db).find({}).toArray());
    const mostPopularCodeBundles = (await findTopCodeBundles(db)).sort((a, b) => b.instances - a.instances).slice(0, 2);
    const contractsCount = (await getContractCollection(db).find({}).toArray()).length;

    return { codeBundlesCount: codeBundles.length, contractsCount, mostPopularCodeBundles }
  } catch (e) {
    throw new Error(e);
  }
}