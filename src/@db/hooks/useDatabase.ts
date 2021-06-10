// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import { useCallback, useContext } from 'react';

import { DbContext } from '../contexts';
import type {
  CodeBundleDocument,
  ContractDocument,
  UserDocument,
  DbProps,
  MyCodeBundles,
  MyContracts,
  UserArtifacts,
} from '../types';

import * as queries from '../queries';
import { useCanvas } from '@canvas';

interface UseDatabase extends DbProps {
  createCodeBundle: (newCode: Partial<CodeBundleDocument>) => Promise<void>;
  createContract: (newContract: Partial<ContractDocument>) => Promise<void>;
  createUser: () => Promise<void>;
  checkForExpiredDocuments: (_: string) => Promise<boolean>;
  dropExpiredDocuments: (excludeBlockOneHash: string) => Promise<void>;
  findMyCodeBundles: () => Promise<UserArtifacts<CodeBundleDocument>>;
  findCodeBundleByHash: (codeHash: string) => Promise<CodeBundleDocument | null>;
  findCodeBundleById: (id: string) => Promise<CodeBundleDocument | null>;
  findMyContracts: () => Promise<UserArtifacts<ContractDocument>>;
  findContractByAddress: (address: string) => Promise<ContractDocument | null>;
  findUser: () => Promise<UserDocument | null>;
  removeCodeBundle: (id: string) => Promise<void>;
  removeContract: (address: string) => Promise<void>;
  starCodeBundle: (id: string) => Promise<void>;
  starContract: (id: string) => Promise<void>;
  unstarCodeBundle: (id: string) => Promise<void>;
  unstarContract: (address: string) => Promise<void>;
  updateCodeBundle: (id: string, updates: Partial<CodeBundleDocument>) => Promise<void>;
  updateContract: (address: string, updates: Partial<ContractDocument>) => Promise<void>;
}

export function useDatabase(): UseDatabase {
  const { api, blockOneHash } = useCanvas();
  const { db, identity, isDbReady, sync } = useContext<DbProps>(DbContext);

  const findUser = useCallback(
    async (): Promise<UserDocument | null> => queries.findUser(db, identity),
    [db, identity]
  );

  const createUser = useCallback(
    async (): Promise<void> => queries.createUser(db, identity).then(sync),
    [db, identity, sync]
  );

  const checkForExpiredDocuments = useCallback(
    async (blockOneHash: string): Promise<boolean> =>
      queries.checkForExpiredDocuments(db, blockOneHash),
    [db]
  );

  const dropExpiredDocuments = useCallback(
    async (blockOneHash: string): Promise<void> => queries.dropExpiredDocuments(db, blockOneHash),
    [db]
  );

  const findMyCodeBundles = useCallback(
    async (): Promise<MyCodeBundles> => queries.findMyCodeBundles(db, identity),
    [db, identity]
  );

  const findCodeBundleByHash = useCallback(
    async (codeHash: string): Promise<CodeBundleDocument | null> =>
      blockOneHash ? queries.findCodeBundleByHash(db, { blockOneHash, codeHash }) : null,
    [db, blockOneHash]
  );

  const findCodeBundleById = useCallback(
    async (id: string): Promise<CodeBundleDocument | null> => queries.findCodeBundleById(db, id),
    [db]
  );

  const findMyContracts = useCallback(
    async (): Promise<MyContracts> => queries.findMyContracts(db, identity),
    [db, identity]
  );

  const findContractByAddress = useCallback(
    async (address: string): Promise<ContractDocument | null> =>
      queries.findContractByAddress(db, address),
    [db]
  );

  const starCodeBundle = useCallback(
    async (id: string): Promise<void> => queries.starCodeBundle(db, identity, id).then(sync),
    [db, identity, sync]
  );

  const unstarCodeBundle = useCallback(
    async (id: string): Promise<void> => queries.unstarCodeBundle(db, identity, id).then(sync),
    [db, identity, sync]
  );

  const starContract = useCallback(
    async (address: string): Promise<void> =>
      queries.starContract(db, identity, address).then(sync),
    [db, identity, sync]
  );

  const unstarContract = useCallback(
    async (address: string): Promise<void> =>
      queries.unstarContract(db, identity, address).then(sync),
    [db, identity, sync]
  );

  const createCodeBundle = useCallback(
    async (fields: Partial<CodeBundleDocument>): Promise<void> =>
      api?.genesisHash &&
      queries
        .createCodeBundle(db, identity, { ...fields, genesisHash: api.genesisHash.toHex() })
        .then(sync),
    [api?.genesisHash, db, identity, sync]
  );

  const updateCodeBundle = useCallback(
    async (id: string, fields: Partial<CodeBundleDocument>): Promise<void> =>
      queries.updateCodeBundle(db, id, fields).then(sync),
    [db, sync]
  );

  const removeCodeBundle = useCallback(
    async (id: string): Promise<void> => queries.removeCodeBundle(db, id).then(sync),
    [db, sync]
  );

  const createContract = useCallback(
    async (fields: Partial<ContractDocument>): Promise<void> =>
      api?.genesisHash &&
      queries
        .createContract(db, identity, { ...fields, genesisHash: api.genesisHash.toHex() })
        .then(sync),
    [api?.genesisHash, db, identity, sync]
  );

  const updateContract = useCallback(
    async (address: string, fields: Partial<ContractDocument>): Promise<void> =>
      api?.genesisHash &&
      queries
        .updateContract(db, address, { ...fields, genesisHash: api.genesisHash.toHex() })
        .then(sync),
    [api?.genesisHash, db, sync]
  );

  const removeContract = useCallback(
    async (address: string): Promise<void> => queries.removeContract(db, address).then(sync),
    [db, sync]
  );

  return {
    checkForExpiredDocuments,
    createCodeBundle,
    createContract,
    createUser,
    db,
    dropExpiredDocuments,
    findCodeBundleByHash,
    findCodeBundleById,
    findMyCodeBundles,
    findContractByAddress,
    findMyContracts,
    findUser,
    identity,
    isDbReady,
    removeCodeBundle,
    removeContract,
    starCodeBundle,
    starContract,
    sync,
    unstarCodeBundle,
    unstarContract,
    updateCodeBundle,
    updateContract,
  };
}
