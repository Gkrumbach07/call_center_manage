import React, { useEffect, useState } from "react";
import { io } from 'socket.io-client';
const ENDPOINT = process.env.REACT_APP_BACKEND_ENDPOINT || "http://0.0.0.0:8080";

export default function ClientComponent() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.on("FromKafka", data => {
      setResponse(data);
    });

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();

  }, []);

  return (
    <p>
      Its {response}
    </p>
  );
}
