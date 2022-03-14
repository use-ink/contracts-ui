// Copyright 2021 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Routes } from 'react-router-dom';
import App from 'ui/components/App';
import './styles/main.css';
import '@polkadot/api-augment';
import '../i18n';
import { AddContract, Contract, Homepage, Instantiate, SelectCodeHash, Settings } from 'ui/pages';

const root = document.getElementById('app-root');

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Homepage />} />
        <Route path="add-contract" element={<AddContract />} />
        <Route path="hash-lookup" element={<SelectCodeHash />} />
        <Route path="/instantiate" element={<Instantiate />}>
          <Route path=":codeHash" />
        </Route>
        <Route path="/contract/:address/" element={<Contract />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  </HashRouter>,
  root
);
