import React, {useState} from 'react';
import styled from 'styled-components'

const Identity = {
    1: 'hsl(60, 10%, 95%)',
    2: 'blue',
    3: 'red',
    4: 'tan',
    5: 'black'
}

export default function WordCard(props) {
    //const [color, setColor] = useState('white');
    const handleCardClick = (e) => {
        // setShowColor(true);
        //setColor(e.target.value)
        let identity = e.target.value
        if(!identity){
            identity = 1
        }
        props.socket.emit('updateBoard', {word: props.cardData.word, identity: parseInt(identity)})
    }

    return (
      <StyledCard value={1} className='Word' onClick={handleCardClick} color={Identity[props.cardData.identity]} >
          {props.cardData.word}
          <StyledButton  value={2}>blue</StyledButton>
          <StyledButton  value={3}>red</StyledButton>
          <StyledButton  value={4}>tan</StyledButton>
          <StyledButton  value={5}>black</StyledButton>
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