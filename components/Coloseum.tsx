
// import React from 'react'
import { AudioRenderer, useParticipant, VideoRenderer } from '@livekit/react-components'
import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const CircleVideo = styled(motion.div)`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    translate: -50% -50%;
    background: black;
    border-radius: 50%;
    background-image: url('img/face.png');
    background-size: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
`

const ColoseumBox = styled(motion.div)`
      position: relative;
      width: 80vh;
      height: 80vh;
      margin: 0 auto;
      top: 50%;
      translate: 0% -50%;

      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        /* border: 2px dashed rgba(128, 128, 128, 0.137); */
        width: calc(100% - 2px * 2);
        height: calc(100% - 2px * 2);
        /* border-radius: 50%; */
    }
`



const getPositions = (width: number, sum: number) => {

        let result = []

        let angle = 90
        let dangle = 360 / sum

        for( let i = 0; i < sum; ++i ){

          angle += dangle

          const b = width / 2
          const n = sum

          const circleR = (b * Math.sin(Math.PI/n)) / (Math.sin(Math.PI/n) + 1)   

          // gap between circles
          // circleR -= 5;

            result.push({
                size: {

                  width: circleR*2 + 'px',
                  height: circleR*2 + 'px',
                },
                preRotate: `rotate(${angle}deg) translate(0px) rotate(-${angle}deg)`,
                transform: `rotate(${angle}deg) translate(${b-circleR}px) rotate(-${angle}deg)`
            })

        }

        return result
    }


    
const Coloseum = () => {
      
      const [people, setPeople] = useState(6)
      
      // animation control
      const controls = useAnimationControls()
      // animatin keyframes
      const sequence = async () => {
          await controls.start({scale: 0.85, transition: {default: { ease: "easeInOut" },duration: 0.20}})
          // await controls.start({scale: 1.02, transition: {default: { ease: "easeInOut" },duration: 0.20}})
          return await controls.start({scale: 1})
      }

    const componentRef = useRef()
    const { width, height } = useContainerDimensions(componentRef)

    const [positions, setPositions] = useState<Array<Object>>([]) 

    useEffect(() => {
        setPositions(getPositions(width, people))
        sequence()
    }, [people, width])
    
  
    return <>
        <div style={{position: 'absolute'}}>
            <button onClick={()=> setPeople(people+1)}>Add</button>
            <button onClick={()=> setPeople(people-1)}>Delete</button>
        </div>

        <ColoseumBox ref={componentRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          animate={controls}
        >
            {
              positions.map( (p, i) => {
                
                      if(i+1 === people){
                        return <CircleVideo key={i} animate={{...p.size, transform: p.transform, transition: {type: "tween",duration: 0.5}}} initial={{transform: p.preRotate, width: 0, height: 0}}/>
                      }else{
                        return <CircleVideo key={i}  animate={{...p.size, transform: p.transform, transition: {type: "tween",duration: 0.5}}} style={p.size}  whileTap={{ scale: 0.8 }}/>
                      }
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