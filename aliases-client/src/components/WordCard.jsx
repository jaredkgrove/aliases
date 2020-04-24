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
    1: 'hsl(217, 30%, 75%)',
    2: 'hsl(0, 30%, 75%)',
    3: 'hsl(48, 30%, 75%)',
    4: 'hsl(0, 0%, 60%)'
}

export default function WordCard(props) {
    const [wordDivFontSize, setWordDivFontSize] = useState(3);

    const wordDiv = useRef(null);
    const revealDiv = useRef(null);

    const handleCardClick = (e) => {
        props.socket.emit('updateBoard', props.cardData.word)
    }

    const handleClick = () => {
        props.socket.emit('changeSelection', props.cardData.word)
    }

    const renderSelections = () => props.spies.map(spy => <PlayerDiv color={props.activeTeam}>{spy.spyName}</PlayerDiv>)

    const renderReveal = () => {
        return props.spies.map(spy => (spy.spyName === props.spyName && props.cardData.identity === 0) ? <StyledButton ref={revealDiv} color='green' onClick={handleCardClick}>TAP TO REVEAL</StyledButton> : '')
    }

    const checkFontsize = () => {
        if(wordDiv.current.scrollWidth > wordDiv.current.clientWidth){
            setWordDivFontSize(wordDivFontSize - 0.25)
        }
    }

    useEffect(() => { 
        checkFontsize()
    }, [wordDivFontSize]);

    useEffect(() => { 
        setWordDivFontSize(3)
        checkFontsize()
    }, [props.cardData.word]);

    useEffect(() => {
        function handleResize() {
            setWordDivFontSize(3)
            checkFontsize()
        }
       
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, []);



    return (
        <ContainerDiv  onClick={handleClick} fontSize={wordDivFontSize}>
            <SelectionsDiv> {renderSelections()} </SelectionsDiv>
            <StyledCard value={1} className='Word' selected={props.spies.length > 0} team={props.activeTeam}  cipherColor={props.cipherData && !props.cipherData.revealed ? Identity[props.cipherData.identity]:null} color={props.cipherData && !props.cipherData.revealed ? CipherIdentity[props.cipherData.identity]:Identity[props.cardData.identity]} >
                <div style={{height:'19%'}}></div>
                <div ref={wordDiv} style={{height:'40%'}}>{props.cardData.word}</div>
                {/* <img style={{display:'block'}} height='100' width='100' src={props.cardData.word} alt=""/> */}
                {renderReveal()}
            </StyledCard>
        </ContainerDiv>
    );
}

const ContainerDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    box-sizing: border-box;
    justify-self: stretch;
    padding: 0px 7.5px 7.5px 7.5px;
    overflow: hidden;
    font-size: ${props => props.fontSize}vh;
`

const SelectionsDiv = styled.div`

    height: 20%;
    width: 100%;
    font-size:2.5vh;
    margin-bottom: 2px;
`

const PlayerDiv = styled.div`
    background: ${props => props.color === 'blue' ? 'hsl(217, 100%, 50%)':'hsl(0, 100%, 50%)'};
    color: white; 
    display: inline-block; 
    padding: 0px 2px 0px 2px; 
    margin: 0px 2px 0px 2px;
    border-radius: 3px;
`

const StyledCard = styled.div`
    white-space: nowrap;
    position:relative;
    flex: 1;
    text-align: center;
    box-sizing: border-box;
    align-self: stretch;
    overflow: hidden;
    width: 100%;
    max-height: 20vw;

    background: ${props => props.color};
    border: ${props => props.cipherColor ? `5px solid ${props.cipherColor}`:'' };
    border-radius: 10px;
    box-shadow: ${props => props.selected ? `${props.team === 'blue' ? '0 0 10px 5px hsl(217, 80%, 80%)':'0 0 10px 5px hsl(0, 80%, 80%)'}`:''};

    user-select: none; 
`;

// const StyledButton = styled.button`

//     left:${props => props.value *40}px;
// `;
// font-size: ${props => props.fontSize}vh;
const StyledButton = styled.div`
    font-size: 2vw;
    color: hsl(0, 5%, 80%);
    font-weight: bold;
    width: 100%;
    height: 40%;
`
// background: ${props => props.color};