import React from 'react';
import { CodeHash } from '../instantiate/CodeHash';
import { FormField } from './FormField';

interface Props {
  codeHash: string;
  name: string;
}

export const CodeHashField = ({ codeHash, name }: Props) => (
  <FormField id="metadata" label="On-Chain Code">
    <CodeHash codeHash={codeHash} name={name} />
  </FormField>
);
