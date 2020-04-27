const express = require("express");
const path = require('path');
const app = express();
const http = require("http");
const server = http.createServer(app);
const axios = require('axios')

const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
// const index = require("./routes/index");
const {words, blueFirstCipher, redFirstCipher, IdentityEnum} = require("./board");
// app.use(index);
app.use(express.static(path.join(__dirname, 'aliases-client/build')));
const io = socketIo(server); // < Interesting!

//Encapsulated objects... sort of

//ROOMS
const getRoom = (roomName) => io.sockets.adapter.rooms[roomName]
const getSpyRoom = (roomName) => io.sockets.adapter.rooms[roomName+'-spymasters']
// const getTeamRoom = (roomName, teamColor) => io.sockets.adapter.rooms[roomName+teamColor];

//SPY MASTERS
const getTeamSpyMaster = (roomName, teamColor) => getSpies(roomName).find(spy => spy.isSpyMaster && spy.team === teamColor)//io.sockets.adapter.rooms[roomName+teamColor].spyMaster
const setSpymaster = (roomName, teamColor, socket) => {
  socket.spyMaster = false
  if(!getTeamSpyMaster(roomName, teamColor)){
    getSpies(roomName).find(spy => spy.spyName === socket.spyName && spy.team === socket.teamColor).isSpyMaster = true
    socket.spyMaster = true
    socket.join(roomName + "-spymasters")
  }
  return socket.spyMaster
}
//const setTeamSpyMaster = (roomName, teamColor, socket) => getSpyRoom(roomName).spyMasters[teamColor] = socket
// const setGifBoard = (roomName, newBoard) => getRoom(roomName).gifBoard = newBoard

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
  let startingTeam = Math.random() >= 0.5 ? 'blue':'red'
  setStartingTeam(roomName, startingTeam)
  let newCipher = generateRandomGameBoard(getBoard(roomName), 25).map((card, i) => ({word: card.word, identity: startingTeam === 'blue'? blueFirstCipher[i].identity:redFirstCipher[i].identity, revealed: false}))
  setCipher(roomName, newCipher)
}
const getCipherIdentity = (roomName, word) => getCipher(roomName).find(card => card.word === word).identity

//TEAMS
const getCurrentTeamColor = (roomName) => getRoom(roomName).currentTurnTeam
const setCurrentTeam = (roomName, teamColor) => getRoom(roomName).currentTurnTeam = teamColor
const setStartingTeam = (roomName, teamColor) => {
  setCurrentTeam(roomName, teamColor)
}

//SPIES
const getSpies = (roomName) => getRoom(roomName) ? getRoom(roomName).spies:[]
const initializeSpies = (roomName) => getRoom(roomName).spies = []
const setSpies = (roomName, newSpyData) => getRoom(roomName).spies = newSpyData
const addSpy = (roomName, spyData) => getSpies(roomName).push(spyData)
const getSpy = (roomName, spyName) => getSpies(roomName).find(spy => spy.spyName === spyName)
const getSpyIndex = (roomName, spyName) => getSpies(roomName).findIndex(spy => spy.spyName === spyName)

const getIdentityString = (identity) => Object.keys(IdentityEnum)[identity].toLowerCase()

//const decrementGuessesRemaining = (roomName) => getRoom(roomName).guessesRemaining-=1

const addSpyToTeam = (roomName, teamColor, spyName, duplicateInt = 0) => {
  if(!getSpies(roomName)){
    initializeSpies(roomName)
  }

  if(!getSpy(roomName, spyName)){
    addSpy(roomName, {spyName: spyName, cardSelection: getWord(roomName, 0), team: teamColor, isSpyMaster: false})
    return spyName
  }else{
    duplicateInt++
    return addSpyToTeam(roomName, teamColor, `${spyName}${duplicateInt}`, false, duplicateInt)
  }
}

const isInGame = (socket, roomName) => {

  if(getRoom(roomName)){
    console.log(socket.id)
    console.log(getRoom(roomName).sockets)
    return getRoom(roomName).sockets[socket.id]
  } else{
    return false
  }
}

const joinGame = (socket, roomName, teamColor) => {

  socket.join(roomName)
  if(!getRoom(roomName).spies){
    getRoom(roomName).spies = []
    //getRoom(roomName).guessesRemaining = 0
  }
  // socket.join(roomName + teamColor)

  
  socket.roomName = roomName
  socket.teamColor = teamColor
}

const initializeGame = (roomName) => {
  initializeBoard(roomName)

  initializeCipher(roomName)
}

const sendBoard = (roomName) => {
  console.log("Board Sent")

  try {
    if(getTeamSpyMaster(roomName, 'blue') && getTeamSpyMaster(roomName, 'red')){
      io.in(roomName).emit("boardUpdate", io.sockets.adapter.rooms[roomName].gameBoard); // Emitting a new message. It will be consumed by the client
      io.in(roomName+"-spymasters").emit("setCipher", getCipher(roomName)); // Emitting a new message. It will be consumed by the client
      // sendCardRemaining(roomName)
      //sendGuessesRemaining(roomName)
    }else{
      io.in(roomName).emit("boardUpdate", Array(25).fill({word: 'Waiting for SpyMasters...', team: null, isSpyMaster: null, identity: IdentityEnum.HIDDEN})); // Emitting a new message. It will be consumed by the client
      io.in(roomName+"-spymasters").emit("setCipher", [{word: 'Waiting for SpyMasters to Join Game', team: null, isSpyMaster: null, identity: IdentityEnum.HIDDEN}]); // Emitting a new message. It will be consumed by the client
    }

  } catch (error) {
    console.error(`Error sendBoard: ${error.code}`);
  }
};

const sendCardRemaining = (roomName) => {
  console.log("Cards Remaining Sent")

  try {
    let blueCluesRevealed = getBoard(roomName).filter(card => card.identity === IdentityEnum.BLUE).length
    let redCluesRevealed = getBoard(roomName).filter(card => card.identity === IdentityEnum.RED).length
    let blueClues = getCipher(roomName).filter(card => card.identity === IdentityEnum.BLUE).length
    let redClues = getCipher(roomName).filter(card => card.identity === IdentityEnum.RED).length
    let blueRemaining = blueClues - blueCluesRevealed
    let redRemaining = redClues - redCluesRevealed

    io.in(roomName).emit("updateCardsRemaining", {blue: blueRemaining, red: redRemaining})//io.sockets.adapter.rooms[io.sockets.adapter.rooms[room].currentTurnTeam].spies); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error sendSpies: ${error.code}`);
  }
};

// const sendGuessesRemaining = (roomName) => {
//   console.log("Guesses Remaining Sent")

//   try {
//     console.log(getRoom(roomName).guessesRemaining)
//     io.in(roomName).emit("updateGuessesRemaining", getRoom(roomName).guessesRemaining)//io.sockets.adapter.rooms[io.sockets.adapter.rooms[room].currentTurnTeam].spies); // Emitting a new message. It will be consumed by the client
//   } catch (error) {
//     console.error(`Error sendSpies: ${error.code}`);
//   }
// };

const sendSpies = (roomName) => {
  console.log("Spies Sent")
  console.log(getSpies(roomName))
  try {
    io.in(roomName).emit("spiesUpdate", getSpies(roomName))//io.sockets.adapter.rooms[io.sockets.adapter.rooms[room].currentTurnTeam].spies); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error sendSpies: ${error.code}`);
  }
};

// const clearBoard = (roomName) => {
//   try {
//     io.in(roomName).emit("spiesUpdate", getSpies(roomName).filter(spy => spy.isSpyMaster))//io.sockets.adapter.rooms[io.sockets.adapter.rooms[room].currentTurnTeam].spies); // Emitting a new message. It will be consumed by the client
//   } catch (error) {
//     console.error(`Error sendSpies: ${error.code}`);
//   }
// };

const sendCurrentTeam = (roomName) => {
  console.log("Active Team Sent")
  io.in(roomName).emit("startTurn", getCurrentTeamColor(roomName))
} 

const switchCurrentTeam = (roomName) => {
  console.log("Team Switched")

  getCurrentTeamColor(roomName) === 'blue' ? setCurrentTeam(roomName, 'red') : setCurrentTeam(roomName, 'blue')
  //getRoom(roomName).guessesRemaining = 0
  // clearBoard(roomName)
  sendSpies(roomName)
  sendCurrentTeam(roomName)
}

const handleEndTurn = (roomName) => {
  console.log("Turn Ended")

  switchCurrentTeam(roomName)

  console.log("Clue Propmpted")

}

// const getGifs = async () => {
//   try {
//     return await axios.get('https://api.giphy.com/v1/gifs/random?api_key=Q0dyd4K1CCkFUINpMJet4h4FxRJmaAUV&tag=&rating=PG')
//   } catch (error) {
//     console.error(error)
//   }
// }//Q0dyd4K1CCkFUINpMJet4h4FxRJmaAUV

io.on("connection", socket => {

  socket.on('joinGame', (roomName, teamColor, spyName) => {
    if(spyName && roomName && teamColor){
      firstPlayer = !getRoom(roomName)

      if(!isInGame(socket, roomName)){
        joinGame(socket, roomName, teamColor)
  
        if(firstPlayer){initializeGame(roomName)}
  
        socket.spyName = addSpyToTeam(roomName, teamColor, spyName)
      }
      socket.emit("SuccessfulJoin", {spyName: socket.spyName, spyMaster: false, roomName: roomName, team: teamColor})
      sendBoard(roomName)
      sendSpies(roomName)
      sendCurrentTeam(roomName)
      console.log(getRoom(roomName))
  
    }
  })

  socket.on('becomeSpymaster', (teamColor) => {
    if(teamColor === socket.teamColor){

      setSpymaster(socket.roomName, teamColor, socket)
      socket.emit("SuccessfulJoin", {spyName: socket.spyName, spyMaster: socket.spyMaster, roomName: socket.roomName, team: teamColor})
      sendBoard(socket.roomName)
      sendSpies(socket.roomName)
      sendCurrentTeam(socket.roomName)

    }
  })

  socket.on('updateBoard', (word) => {
    console.log("updateBoard")

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

      //let guessesLeft = decrementGuessesRemaining(socket.roomName)

      if(identityString !== socket.teamColor){// || guessesLeft === 0){

        handleEndTurn(socket.roomName)
      }
    }
  })

  socket.on('endTurn', (teamColor) => {
    console.log("endTurn")

    if(getCurrentTeamColor(socket.roomName) === teamColor){
      handleEndTurn(socket.roomName)
    }
  })

  // socket.on('submitClue', (clueNumber) => {
  //   console.log("submitClue")
  //   if(parseInt(clueNumber) === 0){
  //     getRoom(socket.roomName).guessesRemaining = 25
  //   }else{
  //     getRoom(socket.roomName).guessesRemaining = parseInt(clueNumber) + 1
  //   }
  //   sendSpies(socket.roomName)
  //   sendCurrentTeam(socket.roomName)
  //   sendGuessesRemaining(socket.roomName)
  // })

  socket.on("changeSelection", (word) => {
    console.log("changeSelection")
    //if(getRoom(socket.roomName).guessesRemaining > 0)
    //{
      if(getWordIndex(socket.roomName, word) >= 0){
        let i = getSpyIndex(socket.roomName, socket.spyName)
        let oldSpiesData = getSpies(socket.roomName)
        let spyMaster = getTeamSpyMaster(socket.roomName, socket.teamColor)
        let newSpiesData = [...oldSpiesData.slice(0, i), {spyName: socket.spyName, cardSelection: word, team: socket.teamColor, isSpyMaster: (spyMaster && (spyMaster.spyName === socket.spyName))}, ...oldSpiesData.slice(i+1)]
        setSpies(socket.roomName, newSpiesData)
    
        sendSpies(socket.roomName)
      }

    //}
  });

  socket.on("getBoard", () => {
    console.log("getBoard")
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