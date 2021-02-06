const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const { createUser, deleteUser, getAllUsers, getUser, updateUser, createMultipleUsers } = require("./controller/userController");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())
app.get('/user/:id',getUser)
app.get('/allUsers',getAllUsers)
app.post('/createUser',createUser) 
app.delete('/deleteUser/:id',deleteUser)
app.patch('/updateUser/:id',updateUser)
app.post('/createMultipleUsers',createMultipleUsers)

const server = app.listen(port,()=>{
    console.log(`Connection Sucessfully estalished on port ${port}`);
})

mongoose.connect('mongodb://localhost/crud1',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB Connetion Successfull");
}).catch(err=>{
    console.log(err.message);
}) 

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });


module.exports = app;