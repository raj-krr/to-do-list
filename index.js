const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require('fs');

const app = express();
const PORT = 8000;

middleware 
 app.use(express.urlencoded ({extended: false}));
 app.use(express.json());


//Routes

app.get('/api/users',(req, res) =>{
    return res.json(users);
});

app.get("/api/users/:id",(req ,res)=>{
    const id =Number( req.params.id);
    const user = users.find((user)=> user.id === id);

     if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
    return res.json(user);

});

//updating 
 app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);

  // If user not found
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  // Merge existing user with new fields from request body
  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;

  // Save back to file
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error updating user" });
    }
    return res.json({ status: "success", user: updatedUser });
  });
});

//deleting user
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  // Find the user by id
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  // Remove the user from array
  const deletedUser = users[userIndex];
  const newUsers = users.filter((user) => user.id !== id);

  // Save updated users back to file
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(newUsers, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting user" });
    }
    return res.json({
      status: "success",
      message: `User ${id} deleted`,
      deletedUser
    });
  });
});

//adding new users
app.post("/api/users",(req, res)=>{
    const body = req.body ;
 console.log( "body",body);
 if (!body.first_name || !body.last_name || !body.email) {
    return res.status(400).json({ message: "Missing required fields" });
  }
 users.push({...body, id:users.length+1});
   fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
    return res.json({status :"success", id: users.length+1});
 });
});


app.listen(PORT ,()=> console.log(`server is starting at port:${PORT} `));