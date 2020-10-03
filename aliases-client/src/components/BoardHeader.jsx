import React from 'react';
import styled from 'styled-components'
import { useInputChange } from './hooks/useInputChange'
import {Grid, ButtonGroup, Paper, makeStyles, FormControl, TextField, Button, FormLabel,RadioGroup,FormControlLabel,Radio,Typography} from '@material-ui/core'

export default function BoardHeader(props) {
  //const [input, handleInputChange] = useInputChange()
    const handleCardClick = (e) => {
        props.socket.emit('endTurn', props.team)
    }

    const handleBecomeSpymaster = (team) => {
      props.socket.emit('becomeSpymaster', team)
  }

    const isOtherTeamActive = (teamColor) => props.blueSpyMaster && props.redSpyMaster && props.activeTeam === teamColor

    const renderClueInputs = (team) => {
      if(props.activeTeam === team){ 
        return (
            <h3>Cards Left{props.cardsRemaining[team]}</h3>
        )
      }
    }

    const renderSpyMaster = (team, spymaster) => {
      if(spymaster){
        return <Typography >Spymaster: {spymaster.spyName}</Typography>
      }else if(team === props.team){
        return <Typography onClick={() => handleBecomeSpymaster(team)}>Tap To Be Spymaster</Typography>
      }else{
        return <Typography >Spymaster: ...</Typography>
      }

    }


    const renderEndTurnButton = (team) => {
      return (props.blueSpyMaster && props.redSpyMaster && team === props.activeTeam && team === props.team && !props.isSpyMaster) ? <Button color={props.activeTeam === 'blue' ? 'primary':'seconday'} onClick={handleCardClick}>End Turn</Button>:''
    }
    return (
      <Grid container>
        <Grid item container xs={6}>
        <Grid item xs={9}>           
          {renderSpyMaster('blue', props.blueSpyMaster)}
        </Grid>
        <Grid item xs={3}>           
           {renderEndTurnButton('blue')}
        </Grid>

        </Grid>
        <Grid item container xs={6}>
           <Grid item xs={9}>           
            {renderSpyMaster('red',  props.redSpyMaster)}
           </Grid>
           <Grid item xs={3}>           
            {renderEndTurnButton('red')}
           </Grid>
        </Grid>  
      </Grid>
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
  box-shadow: 0 0 2.5px 5px ${props => props.color};
`

const SpyMasterDiv = styled.div`
  width: 100%;
  height: 100%;
  font-size: 4vh;
  text-align: center;
  font-weight:bold;
  color: hsl(0, 5%, 90%);
  @media (max-width: 500px) {
    text-align: left;
    font-size: 2vh;
    line-height:5.5vh;

  }
`

const BecomeSpyMaster = styled.div`
  width: 100%;
  height: 100%;
  font-size: 4vh;
  text-align: center;
  font-weight:bold;
  color: hsl(0, 5%, 90%);
  @media (max-width: 500px) {
    text-align: left;
    font-size: 2vh;
    line-height:5.5vh;
  }
`

const StyledInput = styled.input`

  padding: 5px;
  background: ${props => props.color};
  background-clip: content-box;
  outline: none;
  border: none;
  border-radius: 10px;
  height: 100%;
`

const InputContainer = styled.div`
  position: absolute;
  right: 0px;
  box-sizing: border-box;
  height: calc(5vh + 5px);
  min-width: 25%;
`

const StyledButton = styled.div`
  background: ${props => props.color};
  font-size: 4vh;
  outline: none;
  border: none;
  border-radius: 10px;
  height: 100%;
  width: 100%;
  text-align:center;
  font-weight:bold;
  @media (max-width: 500px) {
    font-size: 2vh;
    line-height:5.5vh;
  }
`

const StyledHeader = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 5vh;
  display: flex;
  align-items: center;


`;


