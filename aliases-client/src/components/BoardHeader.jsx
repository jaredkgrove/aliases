import React from 'react';
import styled from 'styled-components'

export default function BoardHeader(props) {
    const handleCardClick = (e) => {
        props.socket.emit('endTurn', props.team)
    }
    return (
      <StyledHeader>
        <button onClick={handleCardClick}>End Turn</button>
      </StyledHeader>
    );
}


const StyledHeader = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  background: black;
  height: 60px;
`;


