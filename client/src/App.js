import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import ClientComponent from "./ClientComponent";


export default function App() {
  const [loadClient, setLoadClient] = useState(true);

  return (
    <div>
      <button onClick={() => setLoadClient(prevState => !prevState)}>
        TOGGLE CLIENT
      </button>
      {loadClient ? <ClientComponent /> : null}
    </div>
  );
}
