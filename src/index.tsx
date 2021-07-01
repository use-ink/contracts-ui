import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/main.css';
import App from '@ui/components/App';

const root = document.getElementById('app-root');

ReactDOM.render(<App />, root);

if (module.hot) {
  module.hot.accept('./ui/components/App', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const NewApp = require('./ui/components/App').default;

    ReactDOM.render(<NewApp />, document.getElementById('app-root'));
  });
}
