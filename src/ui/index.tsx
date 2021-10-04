import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import '../../styles/main.css';
import App from './components/App';

const root = document.getElementById('app-root');
ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  root
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const NewApp = require('./components/App');

    ReactDOM.render(<NewApp />, document.getElementById('app-root'));
  });
}
