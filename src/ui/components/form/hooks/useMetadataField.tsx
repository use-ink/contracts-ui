// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { FileState, OrFalsy, UseMetadata } from 'types';
import { useDatabase } from 'ui/contexts';
import { useDbQuery } from 'ui/hooks';
import { useMetadata } from 'ui/hooks/useMetadata';

interface UseMetadataField extends UseMetadata {
  file: OrFalsy<FileState>;
  isLoading: boolean;
  isStored: boolean;
}

export const useMetadataField = (): UseMetadataField => {
  const { db } = useDatabase();
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();

  const [file, setFile] = useState<OrFalsy<FileState>>(null);

  const [codeBundle, isLoading] = useDbQuery(
    () => db.codeBundles.get({ codeHash: codeHashUrlParam || '' }),
    [codeHashUrlParam, db],
  );
  const metadata = useMetadata(codeBundle?.abi, {
    isWasmRequired: !codeHashUrlParam && window.location.pathname.includes('instantiate'),
    revertOnFileRemove: true,
    onChange: setFile,
  });

  const isStored = useMemo((): boolean => !!codeBundle, [codeBundle]);

  return {
    file,
    isLoading: isLoading && !!codeHashUrlParam,
    isStored,
    ...metadata,
  };
};
