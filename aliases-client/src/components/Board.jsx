import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import CardGrid from './CardGrid'
import BoardHeader from './BoardHeader'

// import IndentityCardsContainer from './IndentityCardsContainer'
export default function Board(props) {
  //const [wordCardPropsArray, setWordCardPropsArray] = useState(initialArray);
  const [cardArray, setCardArray] = useState([{word:"hi"}])
  const [cipher, setCipher] = useState([{}])
  const [spies, setSpies] = useState([{}])
  const [activeTeam, setActiveTeam] = useState('')

  // const [selections, setSelections] = useState([])
  const [toRoomJoin, setToRoomJoin] = useState(false)
  useEffect(() => {
    props.socket.on('boardUpdate', data => setCardArray(data))
    props.socket.on('setCipher', data => setCipher(data))
    props.socket.on('spiesUpdate', data => setSpies(data))
    props.socket.on('startTurn', data => setActiveTeam(data))

    if(!props.spyName){
      setToRoomJoin(true)
    }else{
      props.socket.emit('getBoard')
    }
    return () => {
      props.socket.off('boardUpdate', data => setCardArray(data));
      props.socket.off('setCipher', data => setCipher(data))
      props.socket.off('spiesUpdate', data => setSpies(data))
      props.socket.off('startTurn', data => setActiveTeam(data))
    }
  }, []);
  
    const handleClick = () => {
      
    }
    
    return (
      <>
        <BoardHeader socket={props.socket} team={props.team} activeTeam={activeTeam} blueSpyMaster={spies.find(spy => spy.isSpyMaster && spy.team === 'blue')} redSpyMaster={spies.find(spy => spy.isSpyMaster && spy.team === 'red')}/>
        <StyledBoard onClick={handleClick} > 
          <CardGrid cardArray={cardArray} cipher={cipher} socket={props.socket} spies={spies.filter(spy => !spy.isSpyMaster)} spyName={props.spyName} spyMaster={props.spyMaster} team={props.team} activeTeam={activeTeam}/>
        </StyledBoard>
      </>
    );
}

const StyledBoard = styled.div`
  display: grid;
  padding-top: 60px;
  grid-template-columns: 1fr;
  justify-items: stretch;
  background: white;
  box-sizing: border-box;
  height: calc(100vh - 16px);
  max-width: 100vw;
  overflow: hidden;
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