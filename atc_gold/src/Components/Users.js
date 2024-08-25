import React, { useEffect, useState } from 'react';
import { FaUserCheck } from 'react-icons/fa';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleRemoveUser = (username) => {
    fetch(`http://localhost:5000/${username}`, {
      method: 'DELETE',
    })
      .then(() => {
        setUsers(users.filter(user => user.username !== username));
      })
      .catch(error => console.error('Error removing user:', error));
  };

  return (
    <div className="users-container">
      <h2>Users</h2>
      {users.map(user => (
        <div key={user.username} className="user-card">
          <FaUserCheck className="user-icon" />
          <span className="user-name">{user.username}</span>
          <button onClick={() => handleRemoveUser(user.username)} className="remove-button">❌</button>
        </div>
      ))}
    </div>
  );
};

export default Users;
