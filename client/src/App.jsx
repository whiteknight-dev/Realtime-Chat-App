import "./App.css";
import ConnectedUsersList from "./components/ConnectedUsersList";
import Chat from "./components/Chat";
import { useConnectionStore } from "./store/connectionStore";
import { useConnection } from "./hooks/connection";
import FormNickName from "./components/FormNickName";

function App() {
  const { isConnected, hasJoinedChat } = useConnectionStore();
  useConnection();

  return (
    <div>
      <h1>My Realtime Chat App</h1>
      <p>Conection Status: {isConnected ? "Connected" : "Disconnected"}</p>

      {!hasJoinedChat ? <FormNickName /> : <Chat />}
      <ConnectedUsersList />
    </div>
  );
}

export default App;
