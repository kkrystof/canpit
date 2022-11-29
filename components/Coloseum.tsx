
// import React from 'react'
// import { AudioRenderer, useParticipant, VideoRenderer } from '@livekit/react-components'
import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Participant, Room, RoomEvent, setLogLevel, VideoPresets } from 'livekit-client';
import { AudioRenderer, DisplayContext, DisplayOptions, LiveKitRoom, useParticipant, useRoom, VideoRenderer } from '@livekit/react-components';
import { type } from 'os';


const CircleVideo = styled(motion.div)`
    position: absolute;
    left: 50%;
    top: 50%;
    width: 200px;
    height: 200px;
    translate: -50% -50%;
    background: black;
    border-radius: 50%;
    /* background-image: url('img/face.png'); */
    /* background-size: cover; */
    background-color: black;
    border: 2px solid rgba(255, 255, 255, 0.12);
    overflow: hidden;

    .video{
      /* top: 50%; */
      left: 50%;
      position: absolute;
      translate: -50% 0;

    }
`

const ColoseumBox = styled(motion.div)`
      position: relative;
      width: 90%;
      height: 90%;
      max-height: 100vh;
      max-width: 100vh;
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
    }
`

type PositionType = {
  size: {
    width: string,
    height: string,
  },
  preRotate: string,
  transform: string
}

const getPositions = (width: number, sum: number): Array<PositionType> => {

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


    
const Coloseum = (props: any) => {
      
      const [people, setPeople] = useState(5)
      
      // animation control
      const controls = useAnimationControls()
      // animatin keyframes
      const sequence = async () => {
          await controls.start({scale: 0.85, transition: {default: { ease: "easeInOut" },duration: 0.20}})
          // await controls.start({scale: 1.02, transition: {default: { ease: "easeInOut" },duration: 0.20}})
          return await controls.start({scale: 1})
      }

      type View = any;

    const componentRef = useRef<View>()
    const { width, height } = useContainerDimensions(componentRef)

    const [positions, setPositions] = useState<Array<PositionType>>([]) 

    useEffect(() => {
      (props.total == 1) ? setPositions(getPositions(width, 5)) : setPositions(getPositions(width, props.total));
        sequence()
        // setPeople(props.total)
        // console.log('i am here');
        
    }, [width, props.total, people])
    
  
    return <>
        {/* <div style={{position: 'absolute'}}>
            <button onClick={()=> setPeople(people+1)}>Add</button>
            <button onClick={()=> setPeople(people-1)}>Delete</button>
        </div> */}

        //@ts-ignore
        <ColoseumBox ref={componentRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          animate={controls}
        >
            {!!positions && 
            
              positions.map( (p, i) => {
                      
                      if(i+1 === props.total){
                        return <CircleVideo key={i} animate={{...p.size, transform: p.transform, transition: {type: "tween",duration: 0.5}}} initial={{transform: p.preRotate, width: 0, height: 0}}>
                                {[...props.children][i]}
                                {/* <ParticipantView participant={props.participants[i]} r={p.size.width}></ParticipantView> */}
                              </CircleVideo>
                      }else{
                        return <CircleVideo key={i}  animate={{...p.size, transform: p.transform, transition: {type: "tween",duration: 0.5}}} style={p.size}  whileTap={{ scale: 0.8 }}>
                                {[...props.children][i]}
                                {/* <ParticipantView participant={props.participants[i]} r={p.size.width}></ParticipantView> */}
                              </CircleVideo>
                      }
              }) 
            }

        </ColoseumBox>
    </>
}

export default Coloseum



// interface ParticipantViewProps {
//   participant: Participant,
//   r: string
// }

// const ParticipantView = ({ participant, r }: ParticipantViewProps): ReactElement | null => {
//   // isSpeaking, connectionQuality will update when changed
//   const { isSpeaking, connectionQuality, isLocal, cameraPublication } = useParticipant(participant)
//   console.log(r);
  

//   // user has disabled video
//   if (cameraPublication?.isMuted ?? true) {
//     // render placeholder view
//     return (
//       <></>
//     )
//   }
//   // user is not subscribed to track, for if using selective subscriptions
//   if (!cameraPublication.isSubscribed) {
//     return null;
//   }

//   return (
//     <VideoRenderer track={cameraPublication.track} isLocal={isLocal} className="video" height={r}/>
//   )
// }




// helper
export const useContainerDimensions = (myRef: any) => {
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