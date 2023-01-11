//@ts-nocheck
import React, { ReactElement, useEffect } from 'react';

import styled, { keyframes } from 'styled-components'
import { useForm, SubmitHandler } from "react-hook-form";

import { motion, useAnimationControls } from 'framer-motion'
import { DataPacket_Kind, Participant } from 'livekit-client';
import { useParticipant, VideoRenderer } from '@livekit/react-components';


// enum GenderEnum {
//     female = "female",
//     male = "male",
//     other = "other"
//   }
  
//   interface IFormInput {
//     fullName: String;
//     userName: String;
//   }

//   const defaultFormVals = {
//     fullName: 'Your name',
//     userName: '@user_name'
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


const WhoAmI = ({room, trans, videos}: ActivityPropsType) => {
  
  const [open, setOpen] = React.useState(false);

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
      }
    }

    return cmds[cmd]()
  }


  useEffect(() => {
    if(trans){
      console.log('inside act', trans);
      console.log(room.participants);
      
      cmdHandler(trans)
    }
  }, [trans])


  return <div style={{background: 'red', height: '100%', width: '100%', padding: '3rem'}}>
    <p>Who am I?</p>
    <button onClick={() => {setOpen(current => !current); actTrans({cmd: (open ? 'close' : 'open'), props:{txt: 'I want to open'}})}}>
      {open ? 'Opened' : 'Closed'}
    </button>

    {/* {videos['PA_zd2JpMdE5ZwZ']} */}


  </div>
};



export default WhoAmI;

