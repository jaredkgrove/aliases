import React from 'react';
import styled from 'styled-components'

const Identity = {
    0: 'hsl(60, 10%, 95%)',
    1: 'blue',
    2: 'red',
    3: 'tan',
    4: 'black'
}

const CipherIdentity = {
    0: 'hsl(60, 10%, 95%)',
    1: 'hsl(214, 43%, 74%)',
    2: 'hsl(2, 92%, 74%)',
    3: 'hsl(48, 72%, 75%)',
    4: 'hsl(48°, 0%, 43%)'
}

export default function WordCard(props) {
    //const [color, setColor] = useState('white');
    const handleCardClick = (e) => {
        props.socket.emit('updateBoard', props.cardData.word)
    }

    const handleClick = () => {
        props.socket.emit('changeSelection', props.cardData.word)
    }

    const renderSelections = () => props.spies.map(spy => spy.spyName)

    const renderReveal = () => props.spies.map(spy => spy.spyName === props.spyName ? <StyledButton onClick={handleCardClick}>REAVEAL</StyledButton> : '')

    return (
        <SelectionsDiv selected={props.spies.length > 0} team={props.activeTeam} onClick={handleClick}>
            {renderSelections()}
            {console.log(props.activeTeam)}
            <StyledCard value={1} className='Word'  color={props.cipherData && !props.cipherData.revealed ? CipherIdentity[props.cipherData.identity]:Identity[props.cardData.identity]} >
                {props.cardData.word}
                {renderReveal()}
                {/* <StyledButton  value={3}>red</StyledButton>
                <StyledButton  value={4}>tan</StyledButton>
                <StyledButton  value={5}>black</StyledButton> */}
            </StyledCard>
        </SelectionsDiv>
    );
}

const SelectionsDiv = styled.div`
    box-sizing: border-box;
    justify-self: stretch;


    border: 1px solid ${props => props.selected ? props.team:'transparant'};
    padding: 3px 8px 8px 3px;
`

const StyledCard = styled.div`
    position: relative;
    text-align: center;
    box-sizing: border-box;
    height: 100%;
    line-height: calc(100vh/10);
    font-size: 25px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    background: ${props => props.color};
 
    border-radius: 5px;

    box-shadow: 5px 5px hsl(60, 10%, 80%);
    user-select: none;
`;

const StyledButton = styled.button`
    position: absolute;
    bottom: 0px;
    left:${props => props.value *40}px;
`;