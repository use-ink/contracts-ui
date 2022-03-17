// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { XCircleIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';
import { Input } from '../form/Input';
import { FormField } from '../form/FormField';
import { SearchResults } from '../common/SearchResults';
import { CodeHash } from './CodeHash';
import { useCodeBundle, useCodeBundleSearch } from 'ui/hooks';
import { classes, isValidCodeHash } from 'ui/util';

export function LookUpCodeHash() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchString, setSearchString] = useState('');
  const [codeHash, setCodeHash] = useState('');
  const { data: searchResults } = useCodeBundleSearch(searchString);
  const { data, error, isLoading, isValid } = useCodeBundle(codeHash);
  const { isOnChain, document } = data || { document: null, isOnChain: false };
  useEffect((): void => {
    if (codeHash !== searchString) {
      if (searchString === '' || isValidCodeHash(searchString)) {
        setCodeHash(searchString);
      } else {
        setCodeHash('');
      }
    }
  }, [codeHash, searchString]);

  useEffect((): void => {
    codeHash && setSearchString(codeHash);
  }, [codeHash]);

  return (
    <FormField className="h-36 relative" label={t('lookUpCodeHash', 'Look Up Code Hash')}>
      <Input
        className={classes('relative flex items-center', isOnChain && 'font-mono')}
        isDisabled={isOnChain}
        onChange={setSearchString}
        placeholder={t(
          'codeHashPlaceholder',
          'Paste a code hash or search for existing code bundles already on-chain'
        )}
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
          name={document?.name || t('onChainCodeExists', 'On-chain Code Exists')}
          onClick={isValid ? () => navigate(`/instantiate/${codeHash}`) : undefined}
        />
      )}
    </FormField>
  );
}
