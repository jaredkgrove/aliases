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
const getRoom = (roomName) => io.sockets.adapter.rooms[roomName];
const getTeamRoom = (roomName, teamColor) => io.sockets.adapter.rooms[roomName+teamColor];

//SPY MASTERS
const getTeamSpyMaster = (roomName, teamColor) => io.sockets.adapter.rooms[roomName+teamColor].spyMaster
const setTeamSpyMaster = (roomName, teamColor, socket) => io.sockets.adapter.rooms[roomName+teamColor].spyMaster = socket

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
  console.log(newCipher)
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
const getSpies = (roomName, teamColor) => getRoom(roomName + teamColor).spies
const initializeSpies = (roomName, teamColor) => getRoom(roomName + teamColor).spies = []
const setSpies = (roomName, teamColor, newSpyData) => getRoom(roomName + teamColor).spies = newSpyData
const addSpy = (roomName, teamColor, spyData) => getSpies(roomName, teamColor).push(spyData)
const getSpy = (roomName, teamColor, spyName) => getSpies(roomName, teamColor).find(spy => spy.spyName === spyName)
const getSpyIndex = (roomName, teamColor, spyName) => getSpies(roomName, teamColor).findIndex(spy => spy.spyName === spyName)

const getIdentityString = (identity) => Object.keys(IdentityEnum)[identity].toLowerCase()

const addSpyToTeam = (roomName, teamColor, spyName) => {
  if(!getSpies(roomName, teamColor)){
    initializeSpies(roomName, teamColor)
  }
  if(!getSpy(roomName, teamColor, spyName)){
    addSpy(roomName, teamColor, {spyName: spyName, cardSelection: getWord(roomName, 0)})
  }
}



const joinGame = (socket, roomName, teamColor, spyName, spyMaster) => {
  socket.join(roomName)
  socket.join(roomName + teamColor)
  if(spyMaster && !getTeamSpyMaster(roomName, teamColor)){
    setTeamSpyMaster(roomName, teamColor, socket)
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

    if(getRoom(roomName+'red') && getTeamSpyMaster(roomName, 'red')){
      getTeamSpyMaster(roomName, 'red').emit("setCipher", getCipher(roomName))
    }

    if(getRoom(roomName+'blue') && getTeamSpyMaster(roomName, 'blue')){
      getTeamSpyMaster(roomName, 'blue').emit("setCipher", getCipher(roomName))
    }
  } catch (error) {
    console.error(`Error sendBoard: ${error.code}`);
  }
};

const sendSpies = (roomName, teamColor) => {
  try {
    if(getCurrentTeamColor(roomName) === teamColor){
      io.in(roomName+teamColor).emit("spiesUpdate", getSpies(roomName, teamColor))//io.sockets.adapter.rooms[io.sockets.adapter.rooms[room].currentTurnTeam].spies); // Emitting a new message. It will be consumed by the client
    }else{
      io.in(roomName+teamColor).emit("spiesUpdate", [{}]); // Emitting a new message. It will be consumed by the client
    }
  } catch (error) {
    console.error(`Error sendSpies: ${error.code}`);
  }
};

const switchCurrentTeam = (roomName) => {
  getCurrentTeamColor(roomName) === 'blue' ? setCurrentTeam(roomName, 'red') : setCurrentTeam(roomName, 'blue')
  sendSpies(roomName, 'red')
  sendSpies(roomName, 'blue')
}

io.on("connection", socket => {

  socket.on('joinGame', (roomName, teamColor, spyMaster, spyName) => {
    firstPlayer = !getRoom(roomName)

    joinGame(socket, roomName, teamColor, spyName, spyMaster)

    if(firstPlayer){initializeGame(roomName)}

    addSpyToTeam(roomName, teamColor, spyName)

    sendBoard(roomName)
    sendSpies(roomName, teamColor)
  })

  socket.on('updateBoard', (word) => {
    let caIndex = getWordIndex(socket.roomName, word)
    let cipherIndex = getCipher(socket.roomName).findIndex(c => c.word === word)
    console.log(getCipher(socket.roomName))
    let oldBoard = getBoard(socket.roomName)
    let oldCipher = getCipher(socket.roomName)
    console.log(caIndex)
    console.log(cipherIndex)
    if( caIndex >= 0 && cipherIndex >= 0){

      let newBoard = [...oldBoard.slice(0, caIndex), {word: word, identity:oldCipher[cipherIndex].identity}, ...oldBoard.slice(caIndex+1)]
      let oldCipherCard = oldCipher.slice(cipherIndex, cipherIndex+1)[0]
      let newCipher = [...oldCipher.slice(0, cipherIndex), {word: oldCipherCard.word, identity: oldCipherCard.identity, revealed: true}, ...oldCipher.slice(cipherIndex+1)]
      setBoard(socket.roomName, newBoard)
      console.log(newCipher)
      setCipher(socket.roomName, newCipher)
      sendBoard(socket.roomName)
      console.log( getCipher(socket.roomName))
      let identityString = getIdentityString(getCipherIdentity(socket.roomName, word))//Make this better
 
      if(identityString !== socket.teamColor){
        switchCurrentTeam(socket.roomName)
      }
    }
  })

  socket.on('endTurn', (teamColor) => {
    if(getCurrentTeamColor(socket.roomName) === teamColor){
      switchCurrentTeam(teamColor)
    }
  })

  socket.on("changeSelection", (word) => {
    let i = getSpyIndex(socket.roomName, socket.teamColor, socket.spyName)
    let oldSpyData = getSpies(socket.roomName, socket.teamColor)
    let newSpyData = [...oldSpyData.slice(0, i), {spyName: socket.spyName, cardSelection: word}, ...oldSpyData.slice(i+1)]
    setSpies(socket.roomName, socket.teamColor, newSpyData)
    sendSpies(socket.roomName, socket.teamColor)
  });

  socket.on("getBoard", () => {
    sendBoard(socket.roomName)
    sendSpies(socket.roomName, socket.teamColor)
  });

  socket.on("disconnect", () => {
    if(getTeamRoom(socket.roomName, socket.teamColor)){
      let i = getSpyIndex(socket.roomName, socket.teamColor, socket.spyName)
      let oldSpyData = getSpies(socket.roomName, socket.teamColor)
      let newSpyData = [...oldSpyData.slice(0,i), ...oldSpyData.spies.slice(i+1)]
      setSpies(socket.roomName, socket.teamColor, newSpyData)

      if(socket === getTeamSpyMaster(socket.roomName, socket.teamColor)){
        setTeamSpyMaster(socket.roomName, socket.teamColor, null)
      }
      sendSpies(socket.roomName, socket.teamColor)
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