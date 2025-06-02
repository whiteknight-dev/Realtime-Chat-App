import { useEffect } from "react";
import { io } from "socket.io-client";
import { useConnectionStore } from "../store/connectionStore";
import { useChatStore } from "../store/chatStore";
import { useUserStore } from "../store/userStore";

const SOCKET_SERVER_URL = "http://localhost:3001";

export function useConnection() {
  const { changeConnectionStatus, changeHasJoinedChatStatus, setSocket } =
    useConnectionStore();
  const addNewMessage = useChatStore((state) => state.addNewMessage);
  const updateConnectedUsers = useUserStore(
    (state) => state.updateConnectedUsers
  );

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);

    newSocket.on("connect", () => {
      changeConnectionStatus();
      console.log("The server is connected");
    });

    newSocket.on("disconnect", () => {
      changeConnectionStatus();
      changeHasJoinedChatStatus(); //reset if disconnected
      console.log("The server is disconnected");
    });

    newSocket.on("receiveMessage", (message) => {
      console.log("message: ", message);
      addNewMessage(message);
    });

    newSocket.on("updateUsersList", (actualUsers) => {
      updateConnectedUsers(actualUsers);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);
}
