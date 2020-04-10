import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import CardGrid from './CardGrid'

// import IndentityCardsContainer from './IndentityCardsContainer'
export default function Board(props) {
  //const [wordCardPropsArray, setWordCardPropsArray] = useState(initialArray);
  const [cardArray, setCardArray] = useState([{word:"hi"}]);
  const [cipher, setCipher] = useState([{}]);
  const [spies, setSpies] = useState([{}]);
  // const [selections, setSelections] = useState([])
  const [toRoomJoin, setToRoomJoin] = useState(false)
  useEffect(() => {
    props.socket.on('boardUpdate', data => setCardArray(data));
    props.socket.on('setCipher', data => setCipher(data))
    props.socket.on('spiesUpdate', data => setSpies(data))
    // props.socket.emit('joinGame', game, team, props.spymaster, props.spyName)
    if(!props.spyName){
      setToRoomJoin(true)
    }else{
      props.socket.emit('getBoard')
    }
    return () => {
      props.socket.off('boardUpdate', data => setCardArray(data));
      props.socket.off('setCipher', data => setCipher(data))
      props.socket.off('spiesUpdate', data => setSpies(data))

    }
  }, []);
  
    const handleClick = () => {
      
    }
    
    return (
      // <StyledBoard onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onDragStart={(e) => e.preventDefault()}>
      <StyledBoard onClick={handleClick} > 
      {/* <IndentityCardsContainer identityCardSelect={identityCardSelect} dragCard={dragCard} isDragging={isDragging} x={translateX} y={translateY}/> */}
        <CardGrid cardArray={cardArray} cipher={cipher} socket={props.socket} spies={spies}/>
      </StyledBoard>
    );
}

const StyledBoard = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-items: stretch;
  background: white;
  box-sizing: border-box;
  min-height: calc(100vh - 16px);
`;

// const [isDragging, setIsDragging] = useState(0)
// const [dragCard, setDragCard] = useState({index:null, identity: null})
// const [dropCard, setDropCard] = useState(0)
// const [translateX, setTranslateX] = useState(0)
// const [translateY, setTranslateY] = useState(0)

// const handleMouseDown = (e) => {

  // }

  // const handleMouseMove = (e) => {
  //   if(isDragging && dragCard.index && dragCard.identity){

  //     e.target.hidden = true
  //     let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
  //     let droppableBelow = elemBelow.closest('.Word');
  //     if(droppableBelow){
  //       let rect = droppableBelow.getBoundingClientRect();
  //       setTranslateX(rect.left)
  //       setTranslateY(rect.top)
  //     }else{
  //       setTranslateX(e.clientX - 50)
  //       setTranslateY(e.clientY - 50)
  //     }
  //     e.target.hidden = false
  //   }
  // }

  // const handleMouseUp = (e) => {
  //   setDragCard({index:null, identity: null})
  //   setIsDragging(false)

  //   // setTranslateX(0)
  //   // setTranslateY(0)
  // }

  // const identityCardSelect = (e, cardData) => {
  //   setDragCard(cardData)
  //   setIsDragging(true)
  //   setTranslateX(e.clientX-50)
  //   setTranslateY(e.clientY-50)
  // }