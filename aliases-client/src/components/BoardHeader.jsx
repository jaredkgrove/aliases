import React from 'react';
import styled from 'styled-components'
import { useInputChange } from './hooks/useInputChange'

export default function BoardHeader(props) {
  const [input, handleInputChange] = useInputChange()
    const handleCardClick = (e) => {
        props.socket.emit('endTurn', props.team)
    }

    const handleClueClick = () => {
      props.sendClue(input.clueNumber)
    }

    const renderClueInputs = (team) => {
      if(props.showClueInputs && props.activeTeam === props.team && props.team === team && props.isSpyMaster){
        return(
          <>
            <input type="number" placeholder="Clue Number" name="clueNumber" value={input.clueNumber || 0} onChange={handleInputChange}/>
            <button onClick={handleClueClick}>Submit Clue</button>
          </>
        )
      }
    }

    return (
      <StyledHeader color={props.activeTeam}>

        <TeamDiv color={`hsl(228,${props.activeTeam === 'blue' ? 80:20}%,50%)`}>
          <h3>Spymaster: {`${props.blueSpyMaster ? props.blueSpyMaster.spyName : "Waiting..."}`}</h3>
          <button onClick={handleCardClick}>End Turn</button>
          <div>{props.cardsRemaining.blue}</div>
          {renderClueInputs('blue')}
        </TeamDiv>
        <TeamDiv color={`hsl(5,${props.activeTeam === 'red' ? 80:20}%,50%)`}>
          <h3>Spymaster: {`${props.redSpyMaster ? props.redSpyMaster.spyName : "Waiting..."}`}</h3>
          <button onClick={handleCardClick}>End Turn</button>
          <div>{props.cardsRemaining.red}</div>
          {renderClueInputs('red')}
        </TeamDiv>

      </StyledHeader>
    );

}

const TeamDiv = styled.div`
  width: 50%;
  height: 100%;
  display: inline-block;
  background: ${props => props.color};
  > * {
    display: inline-block;
  }
`




const StyledHeader = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 60px;
`;


