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

    const renderReveal = () => props.spies.map(spy => (spy.spyName === props.spyName && props.cardData.identity === 0) ? <StyledButton onClick={handleCardClick}>REVEAL</StyledButton> : '')

    return (
        <ContainerDiv selected={props.spies.length > 0} team={props.activeTeam} onClick={handleClick}>
            {renderSelections()}
            <StyledCard value={1} className='Word'  color={props.cipherData && !props.cipherData.revealed ? CipherIdentity[props.cipherData.identity]:Identity[props.cardData.identity]} >
                {props.cardData.word}
                {renderReveal()}
            </StyledCard>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    justify-content: stretch;
    align-items: center;
    box-sizingo: border-box;
    justify-self: stretch;
    border: 1px solid ${props => props.selected ? props.team:'transparant'};
    padding: 8px 3px 3px 3px;
    overflow: hidden;
`

const StyledCard = styled.div`
    text-align: center;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    max-height: 20vw;
    font-size: 2.5vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    background: ${props => props.color};
    border-radius: 5px;
    box-shadow: 5px 5px hsl(60, 10%, 80%);
    user-select: none;
    overflow: hidden;

`;

const StyledButton = styled.button`
    position: absolute;
    bottom: 0px;
    left:${props => props.value *40}px;
`;