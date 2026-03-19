function UserItemSmall({ user }) {
  return (
    <div>
      <h4>{user.username}</h4>
      <p>{user.email}</p>
    </div>
  );
}

export default UserItemSmall;