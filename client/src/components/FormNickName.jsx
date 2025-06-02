import { useConnectionStore } from "../store/connectionStore";

function FormNickName() {
  const { socket, isConnected, setNickname, changeHasJoinedChatStatus } =
    useConnectionStore();

  const handleJoinChat = (event) => {
    event.preventDefault();

    const { nickname } = Object.fromEntries(new FormData(event.target));

    if (nickname.trim() === "") return "Please, insert a nickname";

    if (socket && isConnected) {
      socket.emit("join", nickname.trim());
      setNickname(nickname.trim());
      changeHasJoinedChatStatus();
    } else {
      console.log("Unable to connect");
    }
  };

  return (
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
  );
}

export default FormNickName;
