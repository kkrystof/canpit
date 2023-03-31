import React, { useEffect, useState } from 'react';

import styled, { keyframes } from 'styled-components'
import { useForm, SubmitHandler } from "react-hook-form";

import { motion, useAnimationControls } from 'framer-motion'
import { DataPacket_Kind } from 'livekit-client';


// enum GenderEnum {
//     female = "female",
//     male = "male",
//     other = "other"
//   }
  

//@ts-ignore
type ActivityPropsType = {
  room: any,
  trans?: Transport
  videos?: Array<any>,
}

type Transport = {
  type?: string,
  cmd: string,
  props: object
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()


const ClickClick = ({room, trans, videos}: ActivityPropsType) => {
  
  const [open, setOpen] = React.useState(false);
  const [players, setPlayers] = useState([]);

  const actTrans = async (data: Transport, participantId?: string) => {
    // befoe sent -> added type of event
    const payload = encoder.encode(JSON.stringify({type: 'actTrans', ...data}))
    await room.localParticipant.publishData(payload, DataPacket_Kind.RELIABLE)
  }

  const cmdHandler = ({cmd, props}: Transport) => {

    const cmds = {
      'open' : () => {
        setOpen(true)
      },
      'close' : () => {
        setOpen(false)
      },
      'start' : () => {
        // setPlayers(...videos.ids);
        console.log('Created state with players ids -> should not add new players durring activity');
        
      }
    }
    
    //@ts-ignore
    return cmds[cmd]()
  }


  useEffect(() => {
    if(trans){
      console.log('inside act', trans);
      cmdHandler(trans)
      // console.log(room.participants.keys());
      
    }
  }, [trans])


  return <div style={{background: 'gray'}}>
    <p>Click & click</p>
    <button style={{color: 'blue'}} onClick={() => {setOpen(current => !current); actTrans({cmd: (open ? 'close' : 'open'), props:{txt: 'I want to open'}})}}>
      {open ? 'Opened' : 'Closed'}
    </button>
    
    <div style={{height: 200}}>
      {/* {room.participants[0]} */}
      {players.map((p,i) => <button key={i} onClick={() => actTrans({cmd: 'getVids', props:{vids: [p]}})}>{p}</button>)}
      {/* {videos[players[0]]} */}
    </div>
  </div>
};



export default ClickClick;