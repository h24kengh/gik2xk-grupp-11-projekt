import UserItemSmall from './UserItemSmall';

function UserList() {
  const users = [
    // your users here
  ];

  return (
    <ul>
      {users.length > 0 ? (
        users.map((user) => (
          <li key={`user_${user.id}`}>
            <UserItemSmall user={user} />
          </li>
        ))
      ) : (
        <h3>Could not fetch users</h3>
      )}
    </ul>
  );
}

export default UserList;