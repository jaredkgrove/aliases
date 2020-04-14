import React from 'react';
import styled from 'styled-components'

export default function BoardHeader(props) {
    const handleCardClick = (e) => {
        props.socket.emit('endTurn', props.team)
    }
    return (
      <StyledHeader color={props.activeTeam}>

        <TeamDiv color='blue'>
          <h3>Spymaster: {`${props.blueSpyMaster ? props.blueSpyMaster.spyName : "Waiting..."}`}</h3>
          <button onClick={handleCardClick}>End Turn</button>
        </TeamDiv>
        <TeamDiv color='red'>
          <h3>Spymaster: {`${props.redSpyMaster ? props.redSpyMaster.spyName : "Waiting..."}`}</h3>
          <button onClick={handleCardClick}>End Turn</button>

        </TeamDiv>

      </StyledHeader>
    );

}

const TeamDiv = styled.div`
  width: 50%;
  height: 100%;
  display: inline-block;
  background: ${props => props.color};
`




const StyledHeader = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 60px;
`;


