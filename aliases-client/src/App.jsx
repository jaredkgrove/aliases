import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  Switch,
  Route
} from "react-router-dom";

import Board from './components/Board'
import RoomJoin from './components/RoomJoin'
import styled from 'styled-components'
// const socket = io("localhost:4001")
const socket = io("https://anonyms.herokuapp.com/game");

function App () {
  const [spyName, setSpyName] = useState('')
  const [spyMaster, setSpyMaster] = useState(false)
  const [game, setGame] = useState('')
  const [team, setTeam] = useState('')
  const handleGameJoin = (game, team, name) => {
    socket.emit('joinGame', game, team, name)
  }
  const handleSuccessfulJoin = (data) => {
    console.log(data)
    setGame(data.roomName)
    setTeam(data.team)
    setSpyMaster(data.spyMaster)
    setSpyName(data.spyName)
  }
  useEffect(() => {
    socket.on('SuccessfulJoin', data => handleSuccessfulJoin(data));

    return () => {
      socket.off('SuccessfulJoin', data => handleSuccessfulJoin(data));
    }
  }, []);

    return (
        <Switch>
          <Route exact path="/">
            <RoomJoin socket={socket} handleGameJoin={handleGameJoin}></RoomJoin>
          </Route>
          <Route path="/game">
          {!spyName ? <RoomJoin socket={socket} handleGameJoin={handleGameJoin}></RoomJoin> : <Board socket={socket} io={io} spyMaster={spyMaster} spyName={spyName} game={game} team={team}/>}
          </Route>
        </Switch>
    );
}

export default App;

const Layout = styled.div`
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;


`;