// Copyright 2023 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FileState } from '../types';

export const fileToFileState = (file: File): Promise<FileState> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = reject;
    reader.onerror = reject;

    reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
      if (target && target.result) {
        const name = file.name;
        const data = new Uint8Array(target.result as ArrayBuffer);
        const size = data.length;

        resolve({
          data,
          name,
          size,
        } as FileState);
      }
    };

    reader.readAsArrayBuffer(file);
  });
