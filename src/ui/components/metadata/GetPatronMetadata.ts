// Copyright 2023 @paritytech/contracts-ui authors & contributors
import { Buffer } from 'buffer';

function getPatronMetadata(field: string, hash: string) {
  const options = {
    method: 'GET',
    headers:
      field === 'metadata'
        ? {
            'Content-Type': 'application/json',
          }
        : {
            'Content-Type': 'text/plain; charset=UTF-8',
          },
    mode: 'cors' as RequestMode,
  };

  return fetch('https://api.patron.works/buildSessions/' + field + '/' + hash, options).then(
    response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return field === 'metadata' ? response.json() : response.arrayBuffer();
    },
  );
}

export function onDropPatronFile(patronCodeHash: string, onDrop: (files: File[]) => void) {
  const metadataPromise = getPatronMetadata('metadata', patronCodeHash);
  const wasmPromise = getPatronMetadata('wasm', patronCodeHash);
  Promise.all([metadataPromise, wasmPromise])
    .then(([metadataResponse, wasmResponse]) => {
      const result = Buffer.from(wasmResponse as ArrayBuffer).toString('hex');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      metadataResponse.source.wasm = '0x' + result;
      const metadataString = JSON.stringify(metadataResponse);
      const blob = new Blob([metadataString], { type: 'application/json' });
      const patronFile = new File([blob], 'patron-contract.json', {
        lastModified: new Date(0).getTime(),
        type: 'json',
      });
      onDrop([patronFile]);
    })
    .catch(e => {
      console.error(e);
    });
}
