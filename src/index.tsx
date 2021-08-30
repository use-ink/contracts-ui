import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from 'ui/components/App';
import '../styles/main.css';

const root = document.getElementById('app-root');

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  root
);

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('./ui/components/App', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const NewApp = require('./ui/components/App').default;

    ReactDOM.render(<NewApp />, document.getElementById('app-root'));
  });
}
