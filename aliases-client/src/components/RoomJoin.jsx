import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import { useInputChange } from './hooks/useInputChange'
import {
    Link
  } from "react-router-dom";

export default function WordCard(props) {
    const [input, handleInputChange] = useInputChange()

    const handleJoinRoom = (e, team) => {
        if(!input.room || input.room === ''){
            e.preventDefault()
        }else(
            props.handleGameJoin(input.room, team, input.spymaster, input.spyName)
        )       
    };

    return (
      <StyledCard  >
          <h3>Join Room</h3>
          <input type="text"  placeholder="Room Name" name="room" value ={input.room || ''} onChange={handleInputChange}/>
          <input type="text" name="spyName" placeholder="Alias" alue={input.spyName || ''} onChange={handleInputChange}/>
          <input type="checkbox" name="spymaster" value={input.spymaster || false} onChange={handleInputChange}/>
          <Link to="/game" onClick={(e) => handleJoinRoom(e, 'red')}>Join Red Team</Link>
          <Link to="/game" onClick={(e) => handleJoinRoom(e, 'blue')}>Join Blue Team</Link>
      </StyledCard>
    );
}


const StyledCard = styled.div`
    position: relative;
    text-align: center;
    padding-top: 22%;
    font-size: 25px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    background: ${props => props.color};
    justify-self: stretch;
    margin: 5px;
    border-radius: 5px;
    min-height: 50px;
    max-height: 150px;
    box-shadow: 5px 5px hsl(60, 10%, 80%);
    user-select: none;
`;

const StyledButton = styled.button`
    position: absolute;
    bottom: 0px;
    left:${props => props.value *40}px;
`;