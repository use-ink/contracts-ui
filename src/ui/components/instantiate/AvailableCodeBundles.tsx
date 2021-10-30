import React from 'react';
import { useHistory } from 'react-router';
import { CodeHash } from '../CodeHash';
import { FormField } from '../FormField';
import { useAvailableCodeBundles } from 'ui/hooks/useAvailableCodeBundles';

export function AvailableCodeBundles () {
  const history = useHistory();

  const { data } = useAvailableCodeBundles(2);

  const [owned, popular] =  data || [[], []];

  if (owned.length === 0 && popular.length === 0) {
    return null;
  }

  return (
    <>
      <div className="text-sm py-4 text-center dark:text-gray-500">
        Or choose from a code hash below
      </div>
      {owned.length > 0 && (
        <FormField
          label="Uploaded Contract Code"
        >
          {owned.map((codeBundle) => {
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
        </FormField>
      )}
      {popular.length > 0 && (
        <FormField
          label="Popular Contract Code"
        >
          {popular.map((codeBundle) => {
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
        </FormField>
      )}
    </>
  );
}