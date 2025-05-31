function ConnectedUsersList({ connectedUsers }) {
  return (
    <aside>
      <ul>
        {connectedUsers ? (
          connectedUsers.map((user, index) => <li key={index}>{user}</li>)
        ) : (
          <li>There isn't users connected</li>
        )}
      </ul>
    </aside>
  );
}

export default ConnectedUsersList;
