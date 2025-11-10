// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useApi, useDatabase, useVersion } from 'ui/contexts';
import { ContractDocument, ContractPromise, UIContract } from 'types';

export function useStoredContract(address: string): UIContract | undefined {
  const navigate = useNavigate();
  const { api } = useApi();
  const { db } = useDatabase();
  const { version } = useVersion();
  const [contract, setContract] = useState<ContractPromise>();
  const [document, setDocument] = useState<ContractDocument>();

  useLiveQuery(async () => {
    // setting to undefined to prevent metadata "leak" on route change
    // https://github.com/use-ink/contracts-ui/issues/359
    setContract(undefined);
    setDocument(undefined);
    const d = await db.contracts.get({ address });
    if (!d) {
      navigate('/');
    } else {
      const c = new ContractPromise(api, d.abi, address);

      // WORKAROUND: ink v6 uses Address as a type alias for H160, but polkadot.js
      // encodes them differently. Patch the ABI to use H160 for consistent encoding.
      if (version === 'v6') {
        c.abi.messages.forEach(message => {
          message.args.forEach(arg => {
            if (arg.type.type === 'Address') {
              arg.type.type = 'H160';
            }
          });
        });
      }

      setDocument(d);
      setContract(c);
    }
  }, [address, version]);

  if (!document || !contract) return undefined;

  return {
    abi: contract.abi,
    name: contract.abi.info.contract.name.toString(),
    displayName: document.name,
    tx: contract.tx,
    codeHash: document.codeHash,
    address: contract.address.toString(),
    date: document.date,
    id: document.id,
    type: document.external ? 'added' : 'instantiated',
  };
}
