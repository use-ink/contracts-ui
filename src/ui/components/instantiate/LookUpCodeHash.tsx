// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { XCircleIcon } from '@heroicons/react/outline';
import { Input } from '../form/Input';
import { FormField } from '../form/FormField';
import { SearchResults } from '../common/SearchResults';
import { CodeHash } from './CodeHash';
import { useCodeBundle, useCodeBundleSearch } from 'ui/hooks';
import { classes, isValidCodeHash } from 'ui/util';

export function LookUpCodeHash() {
  const history = useHistory();
  const [searchString, setSearchString] = useState('');
  const [codeHash, setCodeHash] = useState<string | null>(null);
  const { data: searchResults } = useCodeBundleSearch(searchString);
  const { data, error, isLoading, isValid } = useCodeBundle(codeHash);
  const [isOnChain, document] = !!data && !isLoading ? data : [false, null];

  useEffect((): void => {
    if (codeHash !== searchString) {
      if (searchString === '' || isValidCodeHash(searchString)) {
        setCodeHash(searchString);
      } else {
        setCodeHash(null);
      }
    }
  }, [codeHash, searchString]);

  useEffect((): void => {
    codeHash && setSearchString(codeHash);
  }, [codeHash]);

  return (
    <FormField className="h-36 relative" label="Look Up Code Hash">
      <Input
        className={classes('relative flex items-center', isOnChain && 'font-mono')}
        isDisabled={isOnChain}
        onChange={setSearchString}
        placeholder="Paste a code hash or search for existing code bundles already on-chain"
        value={searchString}
      >
        {isOnChain && (
          <button className="absolute right-2" onClick={() => setSearchString('')}>
            <XCircleIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
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
      {codeHash && !isLoading && (
        <CodeHash
          className="mt-1"
          codeHash={codeHash}
          error={error}
          isError={!isValid}
          isSuccess={isValid}
          name={document?.name || 'On-chain Code Exists'}
          onClick={isValid ? () => history.push(`/instantiate/hash/${codeHash}`) : undefined}
        />
      )}
    </FormField>
  );
}
