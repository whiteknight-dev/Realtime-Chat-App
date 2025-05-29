import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3001";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("The server is connected");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("The server is disconnected");
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <h1>My Realtime Chat App</h1>
      <p>Conection Status: {isConnected ? "Connected" : "Disconnected"}</p>
    </div>
  );
}

export default App;
