const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const {words, blueFirstCipher, redFirstCipher, IdentityEnum} = require("./board");
app.use(index);

const io = socketIo(server); // < Interesting!

//Encapsulated objects... sort of

//ROOMS
const getRoom = (roomName) => io.sockets.adapter.rooms[roomName]
const getSpyRoom = (roomName) => io.sockets.adapter.rooms[roomName+'-spymasters']
// const getTeamRoom = (roomName, teamColor) => io.sockets.adapter.rooms[roomName+teamColor];

//SPY MASTERS
const getTeamSpyMaster = (roomName, teamColor) => getSpies(roomName).find(spy => spy.isSpyMaster && spy.team === teamColor)//io.sockets.adapter.rooms[roomName+teamColor].spyMaster
//const setTeamSpyMaster = (roomName, teamColor, socket) => getSpyRoom(roomName).spyMasters[teamColor] = socket

//BOARD
const getBoard = (roomName) => getRoom(roomName).gameBoard
const setBoard = (roomName, newBoard) => getRoom(roomName).gameBoard = newBoard
const getWord = (roomName, index) => getBoard(roomName)[index].word
const getWordIndex = (roomName, word) => getBoard(roomName).findIndex(card => card.word === word)
const initializeBoard = (roomName) => {
  let newBoard = generateRandomGameBoard(words, 25).map((word, i) =>  ({word: word, identity: IdentityEnum.HIDDEN}))
  setBoard(roomName, newBoard)
}

//CIPHER
const getCipher = (roomName) => getRoom(roomName).cipher
const setCipher = (roomName, newCipher) => getRoom(roomName).cipher = newCipher
const getCipherCard = (roomName, word) => getCipher(roomName).find(card => card.word === word)

const initializeCipher = (roomName) => {
  let newCipher = generateRandomGameBoard(getBoard(roomName), 25).map((card, i) => ({word: card.word, identity:blueFirstCipher[i].identity, revealed: false}))
  setCipher(roomName, newCipher)
}
const getCipherIdentity = (roomName, word) => getCipher(roomName).find(card => card.word === word).identity

//TEAMS
const getCurrentTeamColor = (roomName) => getRoom(roomName).currentTurnTeam
const setCurrentTeam = (roomName, teamColor) => getRoom(roomName).currentTurnTeam = teamColor
const setStartingTeam = (roomName) => {
  setCurrentTeam(roomName, 'blue')
}

//SPIES
const getSpies = (roomName) => getRoom(roomName).spies
const initializeSpies = (roomName) => getRoom(roomName).spies = []
const setSpies = (roomName, newSpyData) => getRoom(roomName).spies = newSpyData
const addSpy = (roomName, spyData) => getSpies(roomName).push(spyData)
const getSpy = (roomName, spyName) => getSpies(roomName).find(spy => spy.spyName === spyName)
const getSpyIndex = (roomName, spyName) => getSpies(roomName).findIndex(spy => spy.spyName === spyName)

const getIdentityString = (identity) => Object.keys(IdentityEnum)[identity].toLowerCase()

const addSpyToTeam = (roomName, teamColor, spyName, spyMaster) => {
  if(!getSpies(roomName)){
    initializeSpies(roomName)
  }
  if(!getSpy(roomName, spyName)){
    addSpy(roomName, {spyName: spyName, cardSelection: getWord(roomName, 0), team: teamColor, isSpyMaster: spyMaster})
  }
}



const joinGame = (socket, roomName, teamColor, spyName, spyMaster) => {
  socket.join(roomName)
  if(!getRoom(roomName).spies){
    getRoom(roomName).spies = []

  }
  // socket.join(roomName + teamColor)
  if(spyMaster && !getTeamSpyMaster(roomName, teamColor)){
    socket.join(roomName + "-spymasters")
  }

  socket.spyName = spyName
  socket.roomName = roomName
  socket.teamColor = teamColor


}

const initializeGame = (roomName) => {
  initializeBoard(roomName)
  setStartingTeam(roomName)
  initializeCipher(roomName)
}

const sendBoard = (roomName) => {
  try {
    io.in(roomName).emit("boardUpdate", io.sockets.adapter.rooms[roomName].gameBoard); // Emitting a new message. It will be consumed by the client
    io.in(roomName+"-spymasters").emit("setCipher", getCipher(roomName)); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error sendBoard: ${error.code}`);
  }
};

const sendSpies = (roomName) => {
  try {
    io.in(roomName).emit("spiesUpdate", getSpies(roomName))//io.sockets.adapter.rooms[io.sockets.adapter.rooms[room].currentTurnTeam].spies); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error sendSpies: ${error.code}`);
  }
};

const sendCurrentTeam = (roomName) => {
  io.in(roomName).emit("startTurn", getCurrentTeamColor(roomName))
} 

const switchCurrentTeam = (roomName) => {
  getCurrentTeamColor(roomName) === 'blue' ? setCurrentTeam(roomName, 'red') : setCurrentTeam(roomName, 'blue')
  sendSpies(roomName)
  sendCurrentTeam(roomName)
}

io.on("connection", socket => {

  socket.on('joinGame', (roomName, teamColor, spyMaster, spyName) => {
    firstPlayer = !getRoom(roomName)

    joinGame(socket, roomName, teamColor, spyName, spyMaster)

    if(firstPlayer){initializeGame(roomName)}

    addSpyToTeam(roomName, teamColor, spyName, spyMaster)

    sendBoard(roomName)
    sendSpies(roomName)
    sendCurrentTeam(roomName)
    console.log(getRoom(socket.roomName))


  })

  socket.on('updateBoard', (word) => {
    let caIndex = getWordIndex(socket.roomName, word)
    let cipherIndex = getCipher(socket.roomName).findIndex(c => c.word === word)

    let oldBoard = getBoard(socket.roomName)
    let oldCipher = getCipher(socket.roomName)

    if( caIndex >= 0 && cipherIndex >= 0){

      let newBoard = [...oldBoard.slice(0, caIndex), {word: word, identity:oldCipher[cipherIndex].identity}, ...oldBoard.slice(caIndex+1)]
      let oldCipherCard = oldCipher.slice(cipherIndex, cipherIndex+1)[0]
      let newCipher = [...oldCipher.slice(0, cipherIndex), {word: oldCipherCard.word, identity: oldCipherCard.identity, revealed: true}, ...oldCipher.slice(cipherIndex+1)]
      setBoard(socket.roomName, newBoard)

      setCipher(socket.roomName, newCipher)
      sendBoard(socket.roomName)

      let identityString = getIdentityString(getCipherIdentity(socket.roomName, word))//Make this better
 
      if(identityString !== socket.teamColor){
        switchCurrentTeam(socket.roomName)
      }
    }
  })

  socket.on('endTurn', (teamColor) => {
    if(getCurrentTeamColor(socket.roomName) === teamColor){
      switchCurrentTeam(socket.roomName)
    }
  })

  socket.on("changeSelection", (word) => {
    let i = getSpyIndex(socket.roomName, socket.spyName)
    let oldSpiesData = getSpies(socket.roomName)
    let spyMaster = getTeamSpyMaster(socket.roomName,socket.teamColor)
    let newSpiesData = [...oldSpiesData.slice(0, i), {spyName: socket.spyName, cardSelection: word, team: socket.teamColor, isSpyMaster: (spyMaster && (spyMaster.spyName === socket.spyName))}, ...oldSpiesData.slice(i+1)]
    setSpies(socket.roomName, newSpiesData)


    sendSpies(socket.roomName)
  });

  socket.on("getBoard", () => {
    sendBoard(socket.roomName)
    sendSpies(socket.roomName)
  });

  socket.on("disconnect", () => {
    if(getRoom(socket.roomName)){
      let i = getSpyIndex(socket.roomName, socket.spyName)
      let oldSpyData = getSpies(socket.roomName)
      let newSpyData = [...oldSpyData.slice(0,i), ...oldSpyData.slice(i+1)]
      setSpies(socket.roomName, newSpyData)
  
      if(socket.spyName === getTeamSpyMaster(socket.roomName, socket.teamColor)){

      }
      sendSpies(socket.roomName)
    }


    console.log("Client disconnected");
  });
});



server.listen(port, () => console.log(`Listening on port ${port}`));



function generateRandomGameBoard(arr, n) {
  let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}