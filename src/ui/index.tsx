// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from 'ui/components/App';
import './styles/main.css';

const root = document.getElementById('app-root');

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  root
);
