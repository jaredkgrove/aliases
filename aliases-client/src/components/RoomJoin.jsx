import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import { useInputChange } from './hooks/useInputChange'
import {Link} from "react-router-dom";
import {Grid, ButtonGroup, Paper, makeStyles, FormControl, TextField, Button, FormLabel,RadioGroup,FormControlLabel,Radio} from '@material-ui/core'
import {ToggleButton} from '@material-ui/lab'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    
  },
}));

export default function WordCard(props) {
    const [input, handleInputChange] = useInputChange()
    const classes = useStyles();
    const [team, setTeam] = useState('red')
    const handleJoinRoom = (e) => {
        if(!input.room || input.room === ''){
            e.preventDefault()
        }else{
          console.log(1)
            props.handleGameJoin(input.room, team, input.spyName)
        }       
    };
    const handleTeamChange = (team) => setTeam(team)
    return (
      < Grid container 

      justify="center"
      alignItems="center"
      spacing={0}
      style={{ minHeight: '100vh'}}
      >
        <Grid item xs={9} sm={6} lg={4}>
          <Paper elevation={3} className={classes.paper} >
            <Grid 
            container  
            spacing={3}    
            justify="center"
            
            >
              <Grid item xs={9}>
                <TextField fullWidth label="Room Name" variant="outlined" name="room" value ={input.room || ''} onChange={handleInputChange}/>
              </Grid>
              <Grid item xs={9}>
                <TextField fullWidth label="Alias" variant="outlined" name="spyName" value ={input.spyName || ''} onChange={handleInputChange}/>
              </Grid>
              <Grid item xs={9}>
                  <ButtonGroup variant="contained" fullWidth>
                    <Button color={team === 'red' ? 'secondary':'grey'} onClick={() => handleTeamChange('red')}>Red</Button>
                    <Button color={team === 'blue' ? 'primary':'grey'} onClick={() =>handleTeamChange('blue')}>Blue</Button>
                  </ButtonGroup>
              </Grid>
              <Grid item xs={9}>
                <Button fullWidth variant="outlined" color="primary" onClick={handleJoinRoom}>Join Game</Button>
              </Grid>
            </Grid>
          </Paper>  
        </Grid>
      </Grid>
    );
}




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
