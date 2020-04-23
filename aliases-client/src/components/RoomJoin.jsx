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
      <AbsoluteContainer  >
          <h3 style={{color:'hsl(217, 5%, 80%)'}}>Join Room</h3>
          <StyledInput type="text"  placeholder="Room Name" name="room" value ={input.room || ''} onChange={handleInputChange}/>
          <StyledInput type="text" name="spyName" placeholder="Alias" alue={input.spyName || ''} onChange={handleInputChange}/>
          <div>
            <input type="checkbox" name="spymaster" value={input.spymaster || false} onChange={handleInputChange}/>
            <StyledLabel htmlFor="spymaster">Spy Master</StyledLabel>
          </div>
          <div style={{display:'flex', justifyContent:'space-around'}}>
            <StyledLink color='red' to="/game" onClick={(e) => handleJoinRoom(e, 'red')}>Join Red Team</StyledLink>
            <StyledLink color='blue' to="/game" onClick={(e) => handleJoinRoom(e, 'blue')}>Join Blue Team</StyledLink>
          </div>
      </AbsoluteContainer>
    );
}


const AbsoluteContainer = styled.div`
    position: absolute;
    left:50vw;
    top: 50vh;
    transform: translate(-50%, -50%);
    background: hsl(217, 25%, 10%);
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-width: 300px;
`;

const StyledInput = styled.input`
  box-sizing: border-box;
  padding: 5px;
  margin: 5px;
  background: ${props => props.color};
 display: inline-block;
  outline: none;
  border: none;
  border-radius: 10px;
  height: 35px;

`;

const StyledLink = styled(Link)`
  background: ${props => props.color};
    padding: 10px;

    font-weight: bold;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  height: 100%;
  color: hsl(217, 5%, 90%);
`

const StyledLabel = styled.div`
    box-sizing: border-box;
    padding: 5px;
    display: inline-block;
    margin: 5px;

    color: hsl(217, 5%, 80%);


    height: 35px;

`