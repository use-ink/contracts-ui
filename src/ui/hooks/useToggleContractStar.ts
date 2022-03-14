import { useCallback } from 'react';
import { useDatabase } from '../contexts';
import { starContract, unstarContract } from 'db/queries';

export function useToggleContractStar(): (_: string) => Promise<number> {
  const { db, identity, user } = useDatabase();

  return useCallback(
    async (address: string): Promise<number> => {
      try {
        if (!user) {
          throw new Error('Invalid user');
        }

        const isStarred = user.contractsStarred.includes(address);

        if (isStarred) {
          return unstarContract(db, identity, address);
        }

        return starContract(db, identity, address);
      } catch (e) {
        console.error(e);

        throw e;
      }
    },
    [db, identity, user]
  );
}
