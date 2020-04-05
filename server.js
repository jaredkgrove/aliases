const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);


const socketIo = require("socket.io");
// const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const {cardArray, words} = require("./board");
app.use(index);

// let gameCardArray = cardArray

const io = socketIo(server); // < Interesting!

function getRandom(arr, n) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}



const sendBoard = (room) => {
    try {
      // gameCardArray.pop()
      io.in(room).emit("boardUpdate", io.sockets.adapter.rooms[room].gameCardArray); // Emitting a new message. It will be consumed by the client
      //socket.to('game').emit('boardUpdate', gameCardArray)
    } catch (error) {
      console.error(`Error: ${error.code}`);
    }
  };

// let interval;

io.on("connection", socket => {
  let roomName;
  socket.on('joinGame', (room) => {
    roomName = room
    socket.join(room)
    if(!io.sockets.adapter.rooms[room].gameCardArray){
      io.sockets.adapter.rooms[room].gameCardArray = cardArray
      getRandom(words, 25).forEach((word, i) => {
        io.sockets.adapter.rooms[room].gameCardArray[i].word = word
      })
    }
    sendBoard(room)
  })
  console.log("New client connected");
  // sendBoard(socket)

  socket.on('updateBoard', (msg) => {
    let i = cardArray.findIndex(c => c.word === msg.word)
    let oldArray = io.sockets.adapter.rooms[roomName].gameCardArray
    if(i>=0){
      io.sockets.adapter.rooms[roomName].gameCardArray = [...oldArray.slice(0, i), msg, ...oldArray.slice(i+1)]
      sendBoard(roomName)
    }
    
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});



server.listen(port, () => console.log(`Listening on port ${port}`));

