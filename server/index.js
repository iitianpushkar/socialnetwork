const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const router = require("./routes/auth");
const jwt = require("jsonwebtoken");
const Users=require("./models/user")
const io = require("socket.io")(8000, {
  cors: {
    origin: "http://localhost:3001",
  },
});

const corsOptions = {
  origin: "http://localhost:3001",
  //methods: 'GET, POST',
};

app.use(cors(corsOptions));

app.use(express.json());

mongoose
  .connect(process.env.database)
  .then(() => {
    console.log("database connected");
  })
  .catch(() => {
    console.log("error bro");
  });

app.use("/", router);

//socket.io
let users = [];
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("adduser", (userid) => {
    const userexist = users.find((user) => user.userid === userid);
    if (!userexist) {
      const user = { userid, socketid: socket.id };
      if (userid !== "null") {
        users.push(user);
      }
    }
    io.emit("getusers", users);
  });

  socket.on(
    "sendmessage",
   async ({ senderid, receiverid, message, conversationid }) => {
      const receiver = users.find((user) => user.userid === receiverid);
      const user=await Users.findById(senderid)
      if (receiver) {
        io.to(receiver.socketid).to(socket.id).emit("getmessage", {
          senderid,
          message,
          conversationid,
          receiverid,
          user
        });
      }
    }
  );

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketid !== socket.id);
    io.emit("getusers", users);
  });
});

app.listen(3000, () => {
  console.log(`server is running at http://localhost:3000`);
});
