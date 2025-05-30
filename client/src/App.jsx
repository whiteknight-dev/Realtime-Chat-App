import { useState, useEffect } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { useRef } from "react";

const SOCKET_SERVER_URL = "http://localhost:3001";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [nickname, setNickname] = useState("");
  const [hasJoinedChat, setHasJoinedChat] = useState(false);
  const [messages, setMessages] = useState([]);

  // ref to automatically scroll to the bottom
  const messageEndRef = useRef(null);

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
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleSendMessage = (event) => {
    event.preventDefault();

    const { messageInput } = Object.fromEntries(new FormData(event.target));

    if (messageInput.trim() === "") return;

    if (socket && isConnected && hasJoinedChat) {
      socket.emit("sendMessage", messageInput.trim());
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
        <div className="chat-container">
          <h2>Welcome to the chat {nickname}</h2>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <span>{msg.sender}</span> - {msg.message}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              name="messageInput"
              placeholder="my message..."
            />
            <button>Send message</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
