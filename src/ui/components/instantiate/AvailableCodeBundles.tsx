import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { CodeHash } from '../CodeHash';
import { FormField } from '../FormField';
import { useAvailableCodeBundles } from 'ui/hooks/useAvailableCodeBundles';
import { CodeBundleDocument } from 'types';

const PAGE_SIZE = 5;

interface ListProps {
  items: CodeBundleDocument[]
  label: React.ReactNode;
}

function List ({ items, label }: ListProps) {
  const history = useHistory();
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) {
    return null;
  }

  return (
    <FormField
      label={label}
    >
      {items.slice(0, (isExpanded ? 2 : 1) * PAGE_SIZE).map((codeBundle) => {
        return (
          <CodeHash
            className="mb-2 last:mb-0"
            name={codeBundle.name}
            codeHash={codeBundle.codeHash}
            key={codeBundle.codeHash}
            onClick={() => history.push(`/instantiate/hash/${codeBundle.codeHash}`)}
          />
        )
      })}
      {!isExpanded && items.length > PAGE_SIZE && (
        <a
          className='text-xs cursor-pointer dark:text-gray-500 dark:hover:text-gray-300'
          onClick={() => setIsExpanded(true)}
        >
          → Show More
        </a>
      )}
    </FormField>
    )
}

export function AvailableCodeBundles () {
  const { data } = useAvailableCodeBundles(PAGE_SIZE * 2);

  const [owned, popular] =  data || [[], []];

  if (owned.length === 0 && popular.length === 0) {
    return null;
  }

  return (
    <>
      <div className="text-sm py-4 text-center dark:text-gray-500">
        Or choose from a code hash below
      </div>
      <List items={owned} label="Uploaded Contract Code" />
      <List items={popular} label="Popular Contract Code" />
    </>
  );
}