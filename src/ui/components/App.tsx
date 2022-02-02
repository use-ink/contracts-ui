// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AddContract, Contract, Homepage, Instantiate, SelectCodeHash, Layout } from '../pages';
import { AwaitApis } from './AwaitApis';
import {
  ApiContextProvider,
  DatabaseContextProvider,
  InstantiateContextProvider,
} from 'ui/contexts';
import { TransactionsContextProvider } from 'ui/contexts/TransactionsContext';

const App = (): JSX.Element => {
  return (
    <ApiContextProvider>
      <DatabaseContextProvider>
        <AwaitApis>
          <div className="dark">
            <TransactionsContextProvider>
              <InstantiateContextProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Homepage />} />
                    <Route path="add-contract" element={<AddContract />} />
                    <Route path="hash-lookup" element={<SelectCodeHash />} />
                    <Route path="/instantiate">
                      <Route path=":codeHash" element={<Instantiate />} />
                      <Route path="" element={<Instantiate />} />
                    </Route>
                    <Route path="/contract/:address/" element={<Contract />} />
                  </Route>
                </Routes>
              </InstantiateContextProvider>
            </TransactionsContextProvider>
          </div>
        </AwaitApis>
      </DatabaseContextProvider>
    </ApiContextProvider>
  );
};

export default App;
