import React from 'react'
import ReactDOM from 'react-dom'
import '../styles/main.css'
import App from './components/App'

require('file-loader?name=[name].[ext]!../index.html');

const root = document.getElementById('app-root');

ReactDOM.render(<App />, root);
