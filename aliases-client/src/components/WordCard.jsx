import React from 'react';
import styled from 'styled-components'

const Identity = {
    0: 'hsl(217, 5%, 95%)',
    1: 'hsl(217, 100%, 50%)',
    2: 'hsl(0, 100%, 50%)',
    3: 'hsl(48, 100%, 50%)',
    4: 'hsl(0, 0%, 10%)'
}

const CipherIdentity = {
    0: 'hsl(217, 5%, 95%)',
    1: 'hsl(217, 100%, 84%)',
    2: 'hsl(0, 100%, 84%)',
    3: 'hsl(48, 100%, 84%)',
    4: 'hsl(0, 0%, 60%)'
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

    const renderReveal = () => {
        props.spies.map(spy => console.log(spy.spyName === props.spyName && props.cardData.identity === 0))
        return props.spies.map(spy => (spy.spyName === props.spyName && props.cardData.identity === 0) ? <StyledButton color='green' onClick={handleCardClick}>REVEAL</StyledButton> : '')
    }

    return (
        <ContainerDiv  onClick={handleClick}>
            <SelectionsDiv> {renderSelections()} </SelectionsDiv>
            <StyledCard value={1} className='Word' selected={props.spies.length > 0} team={props.activeTeam}  color={props.cipherData && !props.cipherData.revealed ? CipherIdentity[props.cipherData.identity]:Identity[props.cardData.identity]} >
                {props.cardData.word}
                {renderReveal()}
            </StyledCard>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    justify-self: stretch;
    padding: 8px 3px 3px 3px;
    overflow: hidden;
    font-size: 2.5vh;

`


const SelectionsDiv = styled.div`

    height: 25px;
    width: 100%;
    overflow: hidden;
`

const StyledCard = styled.div`
    position:relative;
    flex: 1;
    text-align: center;
    box-sizing: border-box;
    align-self: stretch;
    width: 100%;
    max-height: 20vw;

    background: ${props => props.color};
    border: 1px solid ${props => props.selected ? props.team:'transparant'};

    border-radius: 5px;
    box-shadow: 5px 5px hsl(60, 10%, 80%);
    user-select: none;
    overflow: hidden;

`;

// const StyledButton = styled.button`

//     left:${props => props.value *40}px;
// `;
const StyledButton = styled.button`
    position: absolute;
    bottom: 0px;
    left 0px;
    width: 100%;
    
    margin: auto;
    box-sizing: border-box;
    padding: 5px;
    background: ${props => props.color};
    background-clip: content-box;
    outline: none;
    border: none;
    border-radius: 10px;
    height: 33%;
`