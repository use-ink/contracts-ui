import React, { useState } from 'react';
import { Input } from '../Input';
import { useCodeBundleSearch } from 'ui/hooks';

export function LookUpCodeHash() {
  const [searchString, setSearchString] = useState('');
  const { data: searchResults } = useCodeBundleSearch(searchString);

  return (
    <>
      <Input onChange={setSearchString} value={searchString} />
      {searchResults && searchResults.length > 0 && <div>{JSON.stringify(searchResults)}</div>}
    </>
  );
}
