import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = process.env.BACKEND_ENDPOINT || "http://0.0.0.0:8080";
console.log(ENDPOINT)

export default function ClientComponent() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
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
