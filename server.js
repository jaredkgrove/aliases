const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const {cardArray, words, blueFirstCipher, redFirstCipher} = require("./board");
app.use(index);

const io = socketIo(server); // < Interesting!

function generateRandomGameCardArray(arr, n) {
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

const setCardArrayIfNull = (room) => {
  if(!io.sockets.adapter.rooms[room].gameCardArray){
    io.sockets.adapter.rooms[room].gameCardArray = cardArray
    generateRandomGameCardArray(words, 25).forEach((word, i) => {
      io.sockets.adapter.rooms[room].gameCardArray[i].word = word
    })
  }
}

const setStartingTeamIfNull = (room) => {
  if(!io.sockets.adapter.rooms[room].currentTurnTeam){
    io.sockets.adapter.rooms[room].currentTurnTeam = 'blue'
  }
}

const setCipherIfNull = (room) => {
  if(!io.sockets.adapter.rooms[room].cipher){
    io.sockets.adapter.rooms[room].cipher = blueFirstCipher
    generateRandomGameCardArray(io.sockets.adapter.rooms[room].gameCardArray, 25).forEach((word, i) => {
      io.sockets.adapter.rooms[room].cipher[i].word = word.word
    })
  }
}

const addSpyToTeam = (teamName, spyName, roomName) => {
  if(!io.sockets.adapter.rooms[teamName].spies){
    io.sockets.adapter.rooms[teamName].spies = []
  }
  let i = io.sockets.adapter.rooms[teamName].spies.findIndex(spy => spy.spyName === spyName)
  console.log()
  io.sockets.adapter.rooms[teamName].spies.push({spyName: spyName, cardSelection: io.sockets.adapter.rooms[roomName].gameCardArray[0].word})
}

const sendBoard = (room) => {
  try {
    io.in(room).emit("boardUpdate", io.sockets.adapter.rooms[room].gameCardArray); // Emitting a new message. It will be consumed by the client

    io.in(room + 'spy').emit("setCipher", io.sockets.adapter.rooms[room].cipher); // Emitting a new message. It will be consumed by the client

  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

const sendSpies = (teamRoom) => {
  try {
    io.in(room).emit("spiesUpdate", io.sockets.adapter.rooms[teamRoom].spies); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

io.on("connection", socket => {
  let roomName;
  let teamRoom

  socket.on('joinGame', (room, team, spyMaster, spyName) => {
    console.log(socket)
    console.log(io.sockets.clients())
    roomName = room
    teamRoom = room + team

    if(spyMaster && !io.sockets.adapter.rooms[room+'spy']){
      socket.join(room + 'spy')
    }
    socket.join(teamRoom)
    socket.join(room)
    socket.spyName = spyName

    setCardArrayIfNull(room)
    setStartingTeamIfNull(room)
    setCipherIfNull(room)
    addSpyToTeam(teamRoom, spyName, roomName)

    sendBoard(room)
    sendSpies(room)
  })

  socket.on('updateBoard', (msg) => {
    let caIndex = io.sockets.adapter.rooms[roomName].gameCardArray.findIndex(c => c.word === msg.word)
    let cipherIndex = io.sockets.adapter.rooms[roomName].cipher.findIndex(c => c.word === msg.word && c.identity == msg.identity)
    let oldArray = io.sockets.adapter.rooms[roomName].gameCardArray
    let oldCipher = io.sockets.adapter.rooms[roomName].cipher
    if( caIndex >= 0 && cipherIndex >= 0){
      io.sockets.adapter.rooms[roomName].gameCardArray = [...oldArray.slice(0, caIndex), msg, ...oldArray.slice(caIndex+1)]
      io.sockets.adapter.rooms[roomName].cipher[cipherIndex] = [...oldCipher.slice(0, cipherIndex), {...oldCipher.slice(cipherIndex, cipherIndex+1), ...{revealed: true}}, ...oldCipher.slice(cipherIndex+1)]
      sendBoard(roomName)
    }
  })

  // socket.on('endTurn', (team) => {
  //   let i = cardArray.findIndex(c => c.word === msg.word)
  //   let oldArray = io.sockets.adapter.rooms[roomName].gameCardArray
  //   if(i>=0){
  //     io.sockets.adapter.rooms[roomName].gameCardArray = [...oldArray.slice(0, i), msg, ...oldArray.slice(i+1)]
  //     sendBoard(roomName, teamRoom)
  //   }
  // })

  socket.on("changeSelection", (word) => {
    let i = io.sockets.adapter.rooms[teamRoom].spies.findIndex(spy => spy.spyName === socket.spyName)
    console.log(io.sockets.adapter.rooms[teamRoom].spies)

    io.sockets.adapter.rooms[teamRoom].spies = [...io.sockets.adapter.rooms[teamRoom].spies.slice(0, i), {spyName: socket.spyName, cardSelection: word}, ...io.sockets.adapter.rooms[teamRoom].spies.slice(i+1)]
    console.log(io.sockets.adapter.rooms[teamRoom].spies)
    sendSpies(roomName)
  });

  socket.on("getBoard", () => {
    sendBoard(roomName)
    sendSpies(roomName)
  });

  socket.on("disconnect", () => {
    if(io.sockets.adapter.rooms[teamRoom]){
      let i = io.sockets.adapter.rooms[teamRoom].spies.findIndex(spy => spy.spyName === socket.spyName)
      io.sockets.adapter.rooms[teamRoom].spies = [...io.sockets.adapter.rooms[teamRoom].spies.slice(0,i), ...io.sockets.adapter.rooms[teamRoom].spies.slice(i+1)]
      sendSpies(roomName)
    }

    console.log("Client disconnected");
  });
});



server.listen(port, () => console.log(`Listening on port ${port}`));

