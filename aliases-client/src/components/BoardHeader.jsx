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
      }else if(props.activeTeam === team && props.guessesRemaining > 0){
        return <div>{props.guessesRemaining}</div>
      }else if(props.activeTeam === team){
        return <div>Waiting for Spy Master...</div>
      }
    }

    const renderEndTurnButton = (team) => (team === props.team && !props.isSpyMaster) ? <button onClick={handleCardClick}>End Turn</button>:''

    return (
      <StyledHeader color={props.activeTeam}>

        <TeamDiv color={`hsl(217, 100%, 84%)`}>
          <h3>Spymaster: {`${props.blueSpyMaster ? props.blueSpyMaster.spyName : "Waiting..."}`}</h3>
          {renderEndTurnButton('blue')}
          <div>{props.cardsRemaining.blue}</div>
          {renderClueInputs('blue')}

        </TeamDiv>
        <TeamDiv color={`hsl(0, 100%, 84%)`}>
          <SpyMasterDiv>Spymaster: {`${props.redSpyMaster ? props.redSpyMaster.spyName : "Waiting..."}`}</SpyMasterDiv>
          {renderEndTurnButton('red')}
          <div>{props.cardsRemaining.red}</div>
          {renderClueInputs('red')}

        </TeamDiv>

      </StyledHeader>
    );

}

const TeamDiv = styled.div`


  display: inline-block;
  height: 100%;
  flex: 1;
  background: ${props => props.color};
  > * {
    display: inline-block;
  }
`

const SpyMasterDiv = styled.div`
  height: 100%

`


const StyledHeader = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 60px;
  display: flex;
  align-items: center;
`;


