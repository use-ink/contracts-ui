// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FileState, OrFalsy, UseMetadata } from 'types';
import { useMetadata } from 'ui/hooks/useMetadata';
import { useCodeBundle } from 'ui/hooks/useCodeBundle';

interface UseMetadataField extends UseMetadata {
  file: OrFalsy<FileState>;
  isLoading: boolean;
  isStored: boolean;
}

export const useMetadataField = (): UseMetadataField => {
  const navigate = useNavigate();
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();

  const [file, setFile] = useState<OrFalsy<FileState>>(null);

  const codeBundleQuery = useCodeBundle(codeHashUrlParam || '');
  const codeBundle = codeBundleQuery.data;
  const metadata = useMetadata(codeBundle?.document?.abi, {
    isWasmRequired: !codeBundle,
    onChange: setFile,
  });

  const isLoading = useMemo(
    () => !!codeHashUrlParam && codeBundleQuery.isLoading,
    [codeHashUrlParam, codeBundleQuery.isLoading]
  );

  const isStored = useMemo((): boolean => !!codeBundle?.document, [codeBundle?.document]);

  useEffect((): void => {
    if (codeHashUrlParam && !codeBundleQuery.isValid) {
      navigate(`/instantiate/${codeHashUrlParam}`);
    }
  }, [codeHashUrlParam, codeBundleQuery.isValid, navigate]);

  return {
    file,
    isLoading,
    isStored,
    ...metadata,
  };
};
