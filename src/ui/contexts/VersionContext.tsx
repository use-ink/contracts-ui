// Copyright 2022-2024 use-ink/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useEffect, useContext } from 'react';
import { LOCAL_STORAGE_KEY } from '../../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type InkVersion = 'v5' | 'v6';

export interface VersionSupported {
  version: InkVersion;
  setVersion: (v: InkVersion) => void;
}

const VersionContext = createContext<VersionSupported | undefined>(undefined);

export const VersionContextProvider = ({ children }: React.PropsWithChildren) => {
  const [version, setVersion] = useLocalStorage<InkVersion>(LOCAL_STORAGE_KEY.VERSION, 'v5');

  useEffect(() => setVersion(version), [version]);

  return (
    <VersionContext.Provider value={{ version, setVersion }}>{children}</VersionContext.Provider>
  );
};

export const useVersion = () => {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within VersionContextProvider');
  }
  return context;
};

export const getVersion = () =>
  (localStorage.getItem(LOCAL_STORAGE_KEY.VERSION) as InkVersion | null) || 'v5';
