// Copyright 2021 @paritytech/substrate-contracts-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from 'ui/components/App';
import '../../styles/main.css';

const root = document.getElementById('app-root');

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  root
);

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('./components/App', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const NewApp = require('./components/App');

    ReactDOM.render(<NewApp />, document.getElementById('app-root'));
  });
}
