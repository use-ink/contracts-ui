// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { XCircleIcon } from '@heroicons/react/outline';
import { Input } from '../form/Input';
import { FormField } from '../form/FormField';
import { SearchResults } from '../common/SearchResults';
import { CodeHash } from './CodeHash';
import { checkOnChainCode, filterOnChainCode } from 'services/chain';
import { classes, isValidCodeHash } from 'lib/util';
import { useApi, useDatabase, useVersion } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';

export function LookUpCodeHash() {
  const navigate = useNavigate();
  const { api } = useApi();
  const { db } = useDatabase();
  const { version } = useVersion();
  const [searchString, setSearchString] = useState('');
  const [codeHash, setCodeHash] = useState('');

  const [searchResults] = useDbQuery(async () => {
    const matches = await db.codeBundles
      .filter(({ name, codeHash }) => {
        const regex = new RegExp(searchString);

        return regex.test(name) || regex.test(codeHash);
      })
      .limit(10)
      .toArray();

    return filterOnChainCode(api, matches, version);
  }, [api, db, searchString]);
  const [codeBundle] = useDbQuery(() => db.codeBundles.get({ codeHash }), [codeHash, db]);

  useEffect((): void => {
    if (codeHash !== searchString) {
      if (isValidCodeHash(searchString)) {
        checkOnChainCode(api, searchString, version)
          .then(isOnChain => {
            isOnChain ? setCodeHash(searchString) : setCodeHash('');
          })
          .catch(console.error);
      } else {
        setCodeHash('');
      }
    }
  }, [api, codeHash, searchString]);

  useEffect((): void => {
    codeHash && setSearchString(codeHash);
  }, [codeHash]);

  return (
    <FormField className="relative h-36" label="Look Up Code Hash">
      <Input
        className={classes('relative flex items-center')}
        onChange={setSearchString}
        placeholder="Paste a code hash or search for existing code bundles already on-chain"
        value={searchString}
      >
        {codeBundle && (
          <button className="absolute right-2" onClick={() => setSearchString('')}>
            <XCircleIcon aria-hidden="true" className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </Input>
      <SearchResults
        codeBundles={searchResults}
        isOpen={!codeHash && searchString.length > 0}
        onSelectCodeBundle={document => {
          setCodeHash(document.codeHash);
        }}
      />
      {codeHash && (
        <CodeHash
          className="mt-1"
          codeHash={codeHash}
          isSuccess
          name={codeBundle?.name || 'On-chain Code Exists'}
          onClick={() => navigate(`/instantiate/${codeHash}`)}
        />
      )}
    </FormField>
  );
}
