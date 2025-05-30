function FormNickName({ socket }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const { nickname } = Object.fromEntries(new FormData(event.target));

    // validate the nickname
    if (!nickname) return "Insert a valid nickname";
    if (nickname.length < 3)
      return "The nickname needs to have at least 4 characters";

    socket.emit("join", { nickname });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nickname" />
      <button>Join the chat</button>
    </form>
  );
}

export default FormNickName;
