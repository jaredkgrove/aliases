import React from 'react'
import styled from 'styled-components'
import WordCard from './WordCard'

export default function CardGrid(props) {

  const renderWordCards = () => {
      return props.cardArray.map((data, index) => {
        let cipherData
        if(props.cipher){
          cipherData = props.cipher.find(elem => elem.word === data.word )
        }
        let spies = props.spies.filter(spy => spy.cardSelection === data.word)
        return <WordCard key={index} cardIndex={index} cardData={data} cipherData={cipherData} spies={spies} socket={props.socket} spyName={props.spyName} spyMaster={props.spyMaster} team={props.team}></WordCard>
    })
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
  grid-gap:5px;
  justify-items: center;
  background: white;
`;


