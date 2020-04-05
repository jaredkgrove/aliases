import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  Switch,
  Route
} from "react-router-dom";

import Board from './components/Board'
import RoomJoin from './components/RoomJoin'
import styled from 'styled-components'
const socket = io("http://127.0.0.1:4001");

function App () {
  const [response, setResponse] = useState([{word:"hi"}]);
  // const [endpoint, setEndpoint] = useState("http://127.0.0.1:4001");
  
  // useEffect(() => {
  //   const 

  //   socket.on("boardUpdate", data => {
       
  //     setResponse([
  //       ...data
  //     ])
  //     setCount(count + 1)
  //   });
  //   return
  // }); //only re-run the effect if new message comes in

useEffect(() => {
    const handler = (data) => {setResponse(data)};
    socket.on('boardUpdate', handler);
    
    return () => {
        socket.off('boardUpdate', handler);
    }
}, []);

    return (
      <Layout>
        <Switch>
          <Route exact path="/">
            <RoomJoin socket={socket}></RoomJoin>
          </Route>
          <Route path="/game">
            <Board socket={socket} cardArray={response}/>
          </Route>
        </Switch>
      </Layout>
    );
}

export default App;

const Layout = styled.div`
  display: block;
  min-height: calc(100vh - 16px);
`;