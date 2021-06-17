import React, { useState } from 'react';

export default function Homepage() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Hello</h1>
      <p>You clicked {count} times...</p>
      <button onClick={() => setCount(count + 1)} className="border px-4 py-2 bg-blue-300 text-gray-850">
        Click me
      </button>
    </>
  );
}
