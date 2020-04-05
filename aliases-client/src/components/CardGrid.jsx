import React, {useState} from 'react';
import styled from 'styled-components'
import WordCard from './WordCard'

export default function CardGrid(props) {
  const renderWordCards = () => {
      return props.cardArray.map((data, index) => <WordCard cardIndex={index} cardData={data} isDragging={props.isDragging} socket={props.socket}></WordCard>)
  }
    return (
      <StyledCardGrid>
        {renderWordCards()}
      </StyledCardGrid>
    );
}


const StyledCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: center;
  background: white;
`;


