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
          <ClueInput>
            <StyledInput type="number" placeholder="Clue Number" name="clueNumber" value={input.clueNumber || 0} onChange={handleInputChange}/>
            <StyledButton color={props.activeTeam} onClick={handleClueClick}>Submit Clue</StyledButton>
          </ClueInput>
        )
      }else if(props.activeTeam === team && props.guessesRemaining > 0){
        return <div>{props.guessesRemaining}</div>
      }else if(props.activeTeam === team){
        return <div>Waiting for Spy Master...</div>
      }
    }

    const isOtherTeamActive = (teamColor) => props.blueSpyMaster && props.redSpyMaster && props.activeTeam === teamColor

    const renderEndTurnButton = (team) => (team === props.team && !props.isSpyMaster) ? <button onClick={handleCardClick}>End Turn</button>:''

    return (

      <StyledHeader color={props.activeTeam}>
        <TeamDiv color={`hsl(217, 100%, 84%)`} active={!isOtherTeamActive('red')}>
          <h3>Spymaster: {`${props.blueSpyMaster ? props.blueSpyMaster.spyName : "Waiting..."}`}</h3>
          {renderEndTurnButton('blue')}
          <div>{props.cardsRemaining.blue}</div>
          {renderClueInputs('blue')}

        </TeamDiv>
        <TeamDiv color={`hsl(0, 100%, 84%)`} active={!isOtherTeamActive('blue')}> 
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
  display: ${props => props.active ? "block":"none"};
  flex: ${props => props.active ? 1:0};

  background: ${props => props.color};
  > * {
    display: inline-block;
  }
`

const SpyMasterDiv = styled.div`
  height: 100%

`

const StyledInput = styled.input`
box-sizing: border-box;
padding: 5px;
background: ${props => props.color};
background-clip: content-box;
outline: none;
border: none;
border-radius: 10px;
height: 100%;

`

const ClueInput = styled.div`
  position: absolute;
  right: 0px;
  box-sizing: border-box;
  background-clip: content-box;
  padding: 5px;
  height: 100%;


`

const StyledButton = styled.button`
  box-sizing: border-box;
  padding: 5px;
  background: ${props => props.color};
  background-clip: content-box;
  outline: none;
  border: none;
  border-radius: 10px;
  height: 100%;
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


