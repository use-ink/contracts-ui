// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { XCircleIcon } from '@heroicons/react/outline';
import { Input } from '../form/Input';
import { FormField } from '../form/FormField';
import { SearchResults } from '../common/SearchResults';
import { CodeHash } from './CodeHash';
import { useCodeBundle, useCodeBundleSearch } from 'ui/hooks';
import { classes, isValidCodeHash } from 'ui/util';
import { checkOnChainCode } from 'api';
import { useApi } from 'ui/contexts';

export function LookUpCodeHash() {
  const navigate = useNavigate();
  const { api } = useApi();
  const [searchString, setSearchString] = useState('');
  const [codeHash, setCodeHash] = useState('');
  const { data: searchResults } = useCodeBundleSearch(searchString);
  const { data, error, isLoading, isValid } = useCodeBundle(codeHash);
  const { document } = data || { document: null };
  useEffect((): void => {
    if (codeHash !== searchString) {
      if (searchString === '' || isValidCodeHash(searchString)) {
        checkOnChainCode(api, searchString)
          .then(isOnChain => (isOnChain ? setCodeHash(searchString) : setCodeHash('')))
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
    <FormField className="h-36 relative" label="Look Up Code Hash">
      <Input
        className={classes('relative flex items-center')}
        onChange={setSearchString}
        placeholder="Paste a code hash or search for existing code bundles already on-chain"
        value={searchString}
      >
        {document && (
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
      {codeHash && !isLoading && document && (
        <CodeHash
          className="mt-1"
          codeHash={codeHash}
          error={error}
          isError={!isValid}
          isSuccess={isValid}
          name={document?.name || 'On-chain Code Exists'}
          onClick={isValid ? () => navigate(`/instantiate/${codeHash}`) : undefined}
        />
      )}
    </FormField>
  );
}
