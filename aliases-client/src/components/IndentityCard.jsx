import React, {useState} from 'react';
import styled from 'styled-components'

export default function IndentityCard({x, y, isDragging, handleSelect, identityColor, pos}) {
    // const [isDragging, setIsDragging] = useState(false)
    // const [translateX, setTranslateX] = useState(0)
    // const [translateY, setTranslateY] = useState(0)
    // const [mouseXOffset, setMouseXOffset] = useState(0)
    // const [mouseYOffset, setMouseYOffset] = useState(0)
    // const [mouseX, setMouseX] = useState(0)
    // const [mouseY, setMouseY] = useState(0)
    // const [left, setLeft] = useState(0)
    // const [top, setTop] = useState(0)
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    const handleMouseDown = (e) => {
        // setIsDragging(true)
        e.stopPropagation()
        let rect = e.target.getBoundingClientRect()
        // setMouseXOffset(e.clientX - rect.x)
        // setMouseYOffset(e.clientY - rect.y)
        // setMouseX(e.clientX)
        // setMouseY(e.clientY)
        // setTranslateX(rect.x)
        // setTranslateY(rect.y)
        setWidth(rect.width)
        setHeight(rect.height)
        handleSelect(e, {index: pos, identity: identityColor})
    } 

    const handleMouseUp = (e) => {
        // setIsDragging(false)
        // setTranslateX(0)
        // setTranslateY(0)
    } 

    const handleMouseMove = (e) => { 
        // if(isDragging){
        //     setTranslateX(e.clientX - mouseXOffset)
        //     setTranslateY(e.clientY - mouseYOffset)    
    
        //     //console.log(startX)
        // }
    }

    // const handleMouseLeave = (e) => { 
    //     if(props.isDragging){
    //         let rect = e.target.getBoundingClientRect()
    //         setTranslateX(e.clientX-rect.width/2)
    //         setTranslateY(e.clientY - rect.height/2)    
    //         setMouseXOffset(rect.width/2)
    //         setMouseYOffset( rect.height/2)
    //     }
    // }

    return (
      <StyledDiv 
        identityColor={identityColor} 
        pos={pos} 
        isDragging={isDragging} 
        xx={x} 
        yy={y}  
        width1={width} 
        height1={height} 
        onMouseDown={handleMouseDown}  
        draggable
        // onMouseMove={handleMouseMove} 
        // onMouseUp={handleMouseUp} 
        // onMouseLeave={handleMouseLeave}
    />


    );
}

// ${props => props.absolute ? `
// position: absolute;
// left:${props.left}px;
// top:${props.top}px;
// width:${props.width}px;
// height:${props.height}px;
// `:''}

// transform: translate(${props => `${props.x}px, ${props.y}px`});
// transform: translate(0px,${props => props.pos * -100}%);
const StyledDiv = styled.div`

 
    background: ${props => props.identityColor};
    margin: 5px;
    height: 150px;
    transform: translate(0px,${props => props.pos * -100}%);
    position: relative;
    ${props => props.isDragging ? `
        position: absolute;
        top: 0px;
        left: 0px;
        width: ${props.width1}px;
        height: ${props.height1}px;
        transform:translate(${props.xx}px, ${props.yy}px);
    `:''}
    border-radius: 5px;
    min-height: 50px;
    border-style: solid;
    border-color:black;
`;