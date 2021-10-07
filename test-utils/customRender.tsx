// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ApiContext, DbContext } from '../src/ui/contexts';
import { ApiState, DbState } from '../src/types';

export const customRender = (ui: JSX.Element, apiState: ApiState, dbState: DbState) => {
  return render(
    <ApiContext.Provider value={apiState}>
      <DbContext.Provider value={dbState}>
        <MemoryRouter>{ui}</MemoryRouter>
      </DbContext.Provider>
    </ApiContext.Provider>
  );
};
