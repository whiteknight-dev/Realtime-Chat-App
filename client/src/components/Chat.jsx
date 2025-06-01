import { useChatStore } from "../store/chatStore";
import { useRef, useEffect } from "react";

function Chat({ nickname, socket, isConnected, hasJoinedChat }) {
  const messages = useChatStore((state) => state.messages);

  // ref to automatically scroll to the bottom
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (event) => {
    event.preventDefault();

    const { messageInput } = Object.fromEntries(new FormData(event.target));

    if (messageInput.trim() === "") return;

    if (socket && isConnected && hasJoinedChat) {
      socket.emit("sendMessage", messageInput.trim());
    }

    event.target.reset();
  };

  return (
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
        <input type="text" name="messageInput" placeholder="my message..." />
        <button>Send message</button>
      </form>
    </div>
  );
}

export default Chat;
