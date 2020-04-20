import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  Switch,
  Route
} from "react-router-dom";

import Board from './components/Board'
import RoomJoin from './components/RoomJoin'
import styled from 'styled-components'
const socket = io("https://anonyms.herokuapp.com/");

function App () {
  const [spyName, setSpyName] = useState('')
  const [spyMaster, setSpyMaster] = useState(false)
  const [game, setGame] = useState('')
  const [team, setTeam] = useState('')
  const handleGameJoin = (game, team, spymaster, name) => {
    setSpyMaster(spymaster)
    setSpyName(name)
    setGame(game)
    setTeam(team)
    socket.emit('joinGame', game, team, spymaster, name)
  }

    return (
      <Layout>
        <Switch>
          <Route exact path="/">
            <RoomJoin socket={socket} handleGameJoin={handleGameJoin}></RoomJoin>
          </Route>
          <Route path="/game">
          {!spyName ? <RoomJoin socket={socket} handleGameJoin={handleGameJoin}></RoomJoin> : <Board socket={socket} io={io} spyMaster={spyMaster} spyName={spyName} game={game} team={team}/>}
          </Route>
        </Switch>
      </Layout>
    );
}

export default App;

const Layout = styled.div`
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
`;