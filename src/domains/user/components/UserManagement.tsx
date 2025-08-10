import React from 'react';

interface UserManagementProps {
  // Placeholder for user management props
}

const UserManagement: React.FC<UserManagementProps> = () => {
  // Placeholder for user data
  const users = [
    { id: 1, name: 'Ali', role: 'Cashier' },
    { id: 2, name: 'Sara', role: 'Manager' },
  ];

  return (
    <div style={{ maxWidth: 480, margin: '32px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24 }}>
      <h2>User Management</h2>
      <table style={{ width: '100%', fontSize: 14 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <button style={{ marginRight: 8 }} onClick={() => alert('Button clicked')}>Edit</button>
                <button onClick={() => alert('Button clicked')}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button style={{ marginTop: 16, padding: '8px 16px', borderRadius: 4, background: '#222', color: '#fff', border: 'none' }} onClick={() => alert('Button clicked')}>Add User</button>
    </div>
  );
};

export default UserManagement;



