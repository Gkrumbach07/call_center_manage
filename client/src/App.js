import React, { useState } from 'react';
import ClientComponent from "./ClientComponent";


export default function App() {
  const [loadClient, setLoadClient] = useState(true);
  const [paused, setPaused] = useState(false);

  const handlePause = () => {
    if (!paused) {
      setLoadClient(false)
    }

    setPaused(!paused)
  }

  return (
    <div>
      <div style={{
        display: "flex"
      }}>
        <button onClick={() => setLoadClient(prevState => !prevState)}>
          TOGGLE CONSUMER
        </button>
        {loadClient
          ? <button onClick={() => handlePause()}>
          {paused ? "RESTART" : "PAUSE"}
          </button>
          : null}
      </div>
      {loadClient ? <ClientComponent paused={paused}/> : null}
    </div>
  );
}
