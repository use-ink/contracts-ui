import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FormField, getValidation } from '../FormField';
import { InputFile } from '../InputFile';
import { FileState } from 'types';
import { useMetadata } from 'ui/hooks/useMetadata';
import { useCodeBundle } from 'ui/hooks/useCodeBundle';

export const useMetadataField = () => {
  const navigate = useNavigate();
  const { codeHash: codeHashUrlParam } = useParams<{ codeHash: string }>();

  const [metadataFile, setMetadataFile] = useState<FileState>();

  const codeBundleQuery = useCodeBundle(codeHashUrlParam || '');
  const codeBundle = codeBundleQuery.data;
  const metadata = useMetadata(codeBundle?.document?.abi, {
    isWasmRequired: !codeBundle,
    onChange: setMetadataFile,
  });

  const isLoadingCodeBundle = useMemo(
    () => !!codeHashUrlParam && codeBundleQuery.isLoading,
    [codeHashUrlParam, codeBundleQuery.isLoading]
  );

  const isUsingStoredMetadata = useMemo(
    (): boolean => !!codeBundle?.document,
    [codeBundle?.document]
  );

  useEffect((): void => {
    if (codeHashUrlParam && !codeBundleQuery.isValid) {
      navigate(`/instantiate/${codeHashUrlParam}`);
    }
  }, [codeHashUrlParam, codeBundleQuery.isValid, navigate]);

  const MetadataField = () => {
    return (
      <FormField
        id="metadata"
        label={codeHashUrlParam ? 'Upload Metadata' : 'Upload Contract Bundle'}
        {...getValidation(metadata)}
      >
        <InputFile
          placeholder="Click to select or drag & drop to upload file."
          onChange={metadata.onChange}
          onRemove={metadata.onRemove}
          isError={metadata.isError}
          value={metadataFile}
        />
      </FormField>
    );
  };
  return {
    isLoadingCodeBundle,
    isUsingStoredMetadata,
    MetadataField,
    metadata: metadata.value,
    isErrorMetadata: metadata.isError,
  };
};
