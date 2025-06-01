import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";
import ConnectedUsersList from "./components/ConnectedUsersList";
import { useChatStore } from "./store/chatStore";
import Chat from "./components/Chat";

const SOCKET_SERVER_URL = "http://localhost:3001";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [nickname, setNickname] = useState("");
  const [hasJoinedChat, setHasJoinedChat] = useState(false);
  const addNewMessage = useChatStore((state) => state.addNewMessage);
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("The server is connected");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      setHasJoinedChat(false); //reset if disconnected
      console.log("The server is disconnected");
    });

    newSocket.on("receiveMessage", (message) => {
      console.log("message: ", message);
      addNewMessage(message);
    });

    newSocket.on("updateUsersList", (actualUsers) => {
      setConnectedUsers(actualUsers);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const handleJoinChat = (event) => {
    event.preventDefault();

    const { nickname } = Object.fromEntries(new FormData(event.target));

    if (nickname.trim() === "") return "Please, insert a nickname";

    if (socket && isConnected) {
      socket.emit("join", nickname.trim());
      setNickname(nickname.trim());
      setHasJoinedChat(true);
    } else {
      console.log("Unable to connect");
    }
  };

  return (
    <div>
      <h1>My Realtime Chat App</h1>
      <p>Conection Status: {isConnected ? "Connected" : "Disconnected"}</p>

      {!hasJoinedChat ? (
        <form onSubmit={handleJoinChat}>
          <label htmlFor="nickname">Insert a nickname: </label>
          <input
            type="text"
            name="nickname"
            id="nickname"
            placeholder="John Doe..."
          />
          <button>Join the chat</button>
        </form>
      ) : (
        <Chat
          nickname={nickname}
          socket={socket}
          isConnected={isConnected}
          hasJoinedChat={handleJoinChat}
        />
      )}
      <ConnectedUsersList connectedUsers={connectedUsers} />
    </div>
  );
}

export default App;
