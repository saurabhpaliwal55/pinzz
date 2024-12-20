import { app } from "./app.js";
import { connectDB } from "./utils/connectDB.js";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();
const PORT = process.env.PORT || 3030;

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log("Server started on: ", PORT);
  });
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173",
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("user joined a room: ", room);
    });

    socket.on("typing",(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))


    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;

      if (!chat.users) return console.log("chat.users not defined");

      chat.users.forEach((user) => {
        if (user._id === newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });
  });
});
