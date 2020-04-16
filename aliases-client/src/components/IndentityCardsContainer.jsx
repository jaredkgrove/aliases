import React from 'react';
import styled from 'styled-components'
import IdentityCard from './IndentityCard'

export default function IndentityCardsContainer(props) {
  const renderRedCards = () => [...Array(9)].map((_, i) => {
    return <IdentityCard key={i} pos={i} identityColor='red' x={props.x} y={props.y} isDragging={props.dragCard.index === i && props.dragCard.identity === 'red'} handleSelect={props.identityCardSelect}/>
  })
  const renderBlueCards = () => [...Array(9)].map((_, i) => {
    return <IdentityCard key={i} pos={i} identityColor='blue' x={props.x} y={props.y} isDragging={props.dragCard.index === i && props.dragCard.identity === 'blue'} handleSelect={props.identityCardSelect}/>
  })
  const renderTanCards = () => [...Array(7)].map((_, i) => {
    let isDragging
    let pos = i
    if(props.dragCard.index === i && props.dragCard.identity === 'tan'){
      isDragging = true
    }else if(props.dragCard.index < i && props.dragCard.identity === 'tan'){
      pos = pos - 1
    }
    return <IdentityCard key={i} pos={pos} identityColor='tan' x={props.x} y={props.y} isDragging={isDragging} handleSelect={props.identityCardSelect}/>
  })
  const renderBlackCard = () => [...Array(1)].map((_, i) => {
    return <IdentityCard key={i} pos={i} identityColor='black' x={props.x} y={props.y} isDragging={props.dragCard.index === i && props.dragCard.identity === 'black'} handleSelect={props.identityCardSelect}/>
  })


    const handleMouseDown = (e) => {
    } 
    return (
      <StyledContainer onMouseDown={handleMouseDown}>
          <CardStack>
            {renderBlueCards()}
          </CardStack>
          <CardStack onDragStart={()=>false}>
            {renderRedCards()}
          </CardStack>
          <CardStack onDragStart={()=>false}>
            {renderTanCards()}
          </CardStack>
          <CardStack>
            {renderBlackCard()}
          </CardStack>
      </StyledContainer>
    );
}


const StyledContainer = styled.div`
    display: grid;
    grid-template-rows: repeat(4, 1fr);
    max-height: 100vh;
    overflow:hidden;
    justify-items: stretch;
    align-items: stretch;
`;
// display: relative;
const CardStack = styled.div`
    background: green;
    margin: 5px;
    overflow:hidden;
`;
// top: ${props => props.pos * 2}px;
// left: 0px;
// const IdentityCard = styled.div`
    
//     background: ${props => props.identityColor};
//     margin: 5px;
//     margin-top: ${props => props.pos === 0 ? '5px':'-20%'};
//     border-radius: 5px;
//     min-height: 50px;
//     border-style: solid;
//     border-color:black;
// `;