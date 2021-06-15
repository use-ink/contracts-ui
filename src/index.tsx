import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/main.css';
import App from './components/App';

const root = document.getElementById('app-root');

ReactDOM.render(<App />, root);

/* eslint @typescript-eslint/no-unsafe-member-access: "off",
          @typescript-eslint/no-unsafe-call: "off",
          @typescript-eslint/no-unsafe-assignment: "off",
          @typescript-eslint/no-var-requires: "off",
          @typescript-eslint/no-explicit-any: "off"
*/
//
declare let module: { hot: any };

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NewApp = require('./components/App').default;

    ReactDOM.render(<NewApp />, document.getElementById('app-root'));
  });
}
