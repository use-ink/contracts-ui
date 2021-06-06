import React from 'react'
import ReactDOM from 'react-dom'
import Homepage from './components/Homepage'

export default function App():JSX.Element {
  return (
    <Homepage />
  )
}

const root = document.getElementById('app-root');

ReactDOM.render(<App />, root);
