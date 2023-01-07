import React, { ReactElement, useEffect, useState } from 'react';



import styled, { keyframes } from 'styled-components'
import { useForm, SubmitHandler } from "react-hook-form";

import { DataPacket_Kind, Participant } from 'livekit-client';
import { useParticipant, VideoRenderer } from '@livekit/react-components';
import { createClient} from '@supabase/supabase-js';
import { stringify } from 'querystring';

// import {} from '../../pages/room/[roomID]'



const OnlyQuestions = ({init, videoGet, videoLetgo}) => {

  const supabase = createClient('https://qaylaimlwqzrhawzmclh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFheWxhaW1sd3F6cmhhd3ptY2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjM0MzY1NzgsImV4cCI6MTk3OTAxMjU3OH0.5ECD1bllxD2or1n-64RBalLCHbjQ05LyjCG8jwxRKSA', {
    realtime: {
      params: {
        eventsPerSecond: 1000,
      },
    },
  })
  
  const channel = supabase.channel(init.channel)

  const send = (data: object) => {
    channel.send({
        type: 'broadcast',
        event: 'client',
        payload: data,
      })
}

//   const [number, setNumber] = useState(1000)
//   const [activPlayers, setActivPlayers] = useState([])


  channel.on('broadcast', { event: 'server' }, ({payload}) => {
    cmdHandler(payload)
    
  }).subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      // your callback function will now be called with the messages broadcast by the other client
    }
  })

  type handlerType = {
    cmd: string,
    props: object
  }
  
  const cmdHandler = ({cmd, props} : handlerType) => {

    console.log('-> tady dopice', cmd, props);
    

    const cmds = {
      'initPlayers': (props) => {
        setTwoPlayers(props.twoPlayers)
        setVideo(videoGet(props.twoPlayers))
      },
      'player': () => changePlayer(props),
      'strikes': () => changeStrikes(props)
    }

    return cmds[cmd](props)
  }

  const changePlayer = ({index, player, twoPlayers}) => {
    setTwoPlayers(twoPlayers)

    videoLetgo([player])

    // (index === 0) ? setVideo([videoGet()[0],...video., ]) : setVideo([videoGet()[0],...video, ])
    // asi lepsi zpusob ^^

    setVideo([... video.splice(index, 1, videoGet([player])[0])])
  }

  const changeStrikes = ({strikes}) => {
    setStrikes(strikes)
  }


  useEffect(() => {

    console.log(init);
    
    // if(trans){      
    //   // cmdHandler(trans)
    // }
  }, [])

  const [video, setVideo] = useState([])
  const [twoPlayers, setTwoPlayers] = useState([])
  const [strikes, setStrikes] = useState({})


  return <>
  <div style={{background: 'blue', height: '100%', width: '100%', padding: '3rem'}}>

    <p>Questions</p>

    <button onClick={() => {setVideo(videoGet([init.players[0]])[0])}}>Get video</button>
    <button onClick={() => videoLetgo([init.players[0]])}>Let it</button>

    <Arena>
      <div>
        <h2>{twoPlayers[0]} - {strikes[twoPlayers[0]]}❌</h2>
        <CircleVideo onClick={() => send({cmd: 'strike', props: {id: twoPlayers[0]}})}>
          {video[0]}
        </CircleVideo>
      </div>
      <div>
      <h2>{twoPlayers[1]} - {strikes[twoPlayers[1]]}❌</h2>
        <CircleVideo onClick={() => send({cmd: 'strike', props: {id: twoPlayers[1]}})}>
          {video[1]}
        </CircleVideo>
      </div>
    </Arena>


    {/* <p>{JSON.stringify(init)}</p> */}

  </div>
  </>
};



export default OnlyQuestions;


const Arena = styled.div`
  display: flex;
  position: relative;
  /* left: 50%;
  top: 50%;
  translate: -50% -50%; */
  flex-direction: column;
  gap: 1rem;

`

const CircleVideo = styled.div`
    position: relative;
    width: 200px;
    height: 200px;
    /* background: black; */
    border-radius: 50%;

    /* background-color: black; */
    border: 2px solid rgba(255, 255, 255, 0.12);
    overflow: hidden;

    .video{
      /* top: 50%; */
      left: 50%;
      position: absolute;
      translate: -50% 0;

    }
`