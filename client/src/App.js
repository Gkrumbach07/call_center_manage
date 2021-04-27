import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import ClientComponent from "./ClientComponent";


export default function App() {
  const [loadClient, setLoadClient] = useState(true);
  const [paused, setPaused] = useState(false);

  const handlePause = () => {
    setPaused(!paused)

  }

  return (
    <div>
      <div style:{{
        display: "flex"
      }}>
        <button onClick={() => setLoadClient(prevState => !prevState)}>
          TOGGLE CONSUMER
        </button>
        <button onClick={() => handlePause()}>
          {paused ? "PLAY" : "PAUSE"}
        </button>
      </div>
      {loadClient ? <ClientComponent paused/> : null}
    </div>
  );
}
