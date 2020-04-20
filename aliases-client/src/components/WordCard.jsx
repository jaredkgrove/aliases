import React, {useState, useRef, useEffect} from 'react';
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
    const [adjustedFontSize, setAdjustedFontSize] = useState(3);
    const wordDiv = useRef(null);
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

    const checkFontsize = () => {
        if(wordDiv.current.scrollWidth > wordDiv.current.clientWidth){
            setAdjustedFontSize(adjustedFontSize - 0.25)
        }
    }

    useEffect(() => {
        console.log("hello")
        checkFontsize()
    }, [adjustedFontSize]);

    useEffect(() => {
        function handleResize() {
            setAdjustedFontSize(3)
            checkFontsize()
        }
       
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, []);



    return (
        <ContainerDiv  onClick={handleClick} fontSize={adjustedFontSize}>
            <SelectionsDiv> {renderSelections()} </SelectionsDiv>
            <StyledCard value={1} className='Word' selected={props.spies.length > 0} team={props.activeTeam}  color={props.cipherData && !props.cipherData.revealed ? CipherIdentity[props.cipherData.identity]:Identity[props.cardData.identity]} >
                <div style={{height:'19%'}}></div>
                <div ref={wordDiv} style={{height:'40%'}}>{props.cardData.word}</div>
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
    padding: 0px 2px 0px 2px;
    overflow: hidden;
    font-size: ${props => props.fontSize}vh;
`

const SelectionsDiv = styled.div`
    height: 15px;
    width: 100%;

`

const StyledCard = styled.div`
    white-space: nowrap;
    position:relative;
    flex: 1;
    text-align: center;
    box-sizing: border-box;
    align-self: stretch;
    justify-self: stretch;
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

    width: 80%;
    margin: auto;
    box-sizing: border-box;
    background: ${props => props.color};
    outline: none;
    border: none;
    border-radius: 10px;
    height: 40%;
    font-size: 1.5vh;
`