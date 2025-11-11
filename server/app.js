const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // allow frontend to talk to backend

// Example API endpoint
app.get("/api/users", (req, res) => {
  const users = [
    { name: "Vikash", age: 21 },
    { name: "Ravi", age: 25 }
  ];
  res.json(users);
  console.log("✅ Sent users data");
});

app.listen(5000, () => console.log("✅ Backend running on port 5000"));
