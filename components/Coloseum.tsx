
// import React from 'react'
import { AudioRenderer, useParticipant, VideoRenderer } from '@livekit/react-components'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const CircleVideo = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    /* margin: calc( -100px / 2 ); */
    translate: -50% -50%;
    background: black;
    border-radius: 50%;
    /* transition: all 5000ms ease-in-out; */
    background-image: url('img/face.png');
    background-size: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
`

const ColoseumBox = styled.div`
      position: relative;
      width: 50vw;
      height: 50vw;
      /* margin: calc(100px / 2 + 0px); */
      margin: 0 auto;
      top: 50%;
      /* left: 50%; */
      translate: 0% -50%;

      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        border: 2px dashed rgba(128, 128, 128, 0.137);
        width: calc(100% - 2px * 2);
        height: calc(100% - 2px * 2);
        /* border-radius: 50%; */
    }
`



const getPositions = (width: number, sum: number) => {


        let result = []

        let angle = 90
        let dangle = 360 / sum // rozdeleni 360 do vysecu podle poctu prvku

        for( let i = 0; i < sum; ++i ){

        angle += dangle

        const b = width / 2
        const n = sum

        const circleR = (b * Math.sin(Math.PI/n)) / (Math.sin(Math.PI/n) + 1)        
        // circleR *=.8;

        result.push({
            width: circleR*2 + 'px',
            height: circleR*2 + 'px',
            transform: `rotate(${angle}deg) translate(${b-circleR}px) rotate(-${angle}deg)`
        })

        }

        return result

    }
  
  

const Coloseum = () => {

    const [people] = useState(2)
    
    const componentRef = useRef()
    const { width, height } = useContainerDimensions(componentRef)

    const [positions, setPositions] = useState<Array<Object>>([]) 

    useEffect(() => {
        setPositions(getPositions(width, people))
        // console.log(props);
        
        
    }, [people, width])
    


    return <>
        <ColoseumBox ref={componentRef}>
            {
                positions.map( p => {

                  return  <CircleVideo style={p}/>
                })
            }
        </ColoseumBox>
    </>
}

export default Coloseum




// helper
export const useContainerDimensions = myRef => {
    const getDimensions = () => ({
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight
    })
  
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
    useEffect(() => {
      const handleResize = () => {
        setDimensions(getDimensions())
      }
  
      if (myRef.current) {
        setDimensions(getDimensions())
      }
  
      window.addEventListener("resize", handleResize)
  
      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }, [myRef])
  
    return dimensions;
  };