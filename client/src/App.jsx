import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")  // 👈 URL of your backend
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map((u, i) => (
          <li key={i}>{u.name} - {u.age}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
