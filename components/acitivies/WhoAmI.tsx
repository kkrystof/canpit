//@ts-nocheck
import React, { ReactElement, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components'
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';




const whoAmI = ({init, videoGet, videoLetgo}) => {

  const supabaseClient = supabase
  const channel = supabaseClient.channel(init.channel)
  
  const send = (data: object) => {
    channel.send({
        type: 'broadcast',
        event: 'client',
        payload: data,
      })
}

channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      // your callback function will now be called with the messages broadcast by the other client
      channel.on('broadcast', { event: 'server' }, ({payload}) => {
          console.log(payload);
          cmdHandler(payload)        
        })
    }
  })


  type handlerType = {
    cmd: string,
    props: object
  }
  
  const cmdHandler = ({cmd, props} : handlerType) => {

    // console.log('-> tady dopice', cmd, props);
    

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

  const changePlayer = async ({strikes, index, prevPlayer, twoPlayers}) => {
    setTwoPlayers(twoPlayers)
    
        
    await setVideo(videoGet(twoPlayers))
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // videoLetgo([prevPlayer]);
    // console.log('po spusteni letgo', [prevPlayer]);
    
    // setStrikes(strikes)
    // let s = striked
    // s[index] = false
    // setStriked(s)
    // setStriked([...striked.filter(p => p !== prevPlayer)])

    // (index === 0) ? setVideo([videoGet([player])[0], ...video[1]]) : setVideo([...video[0], videoGet([player])[0]])
    // asi lepsi zpusob ^^

    // setVideo([... video.splice(index, 1, videoGet([player])[0])])
  }

  const changeStrikes = ({strikes}) => {
    setStrikes(strikes)
  }


  useEffect(() => {

    console.log(init);

    return () => {
      // Anything in here is fired on component unmount.
      channel.unsubscribe()
      videoLetgo(twoPlayers)
    }
  },[])


  const [video, setVideo] = useState([])
  const [twoPlayers, setTwoPlayers] = useState(false)
  const [strikes, setStrikes] = useState({})

  const [striked, setStriked] = useState([false, false])

  const sendStrike = (id: string) => {
    // if(!striked.includes(id)){
      console.log('strike send');
      send({cmd: 'strike', props: {id: id}})
      // setStriked([...striked, id])
    // }
  }

  const iAmReady = event => {
    event.currentTarget.disabled = true;
    send({cmd: 'ready', props: {id: init.players[0]}})
  };



  return <>
  <Layout>
    {/* <p>{}</p> */}

    {/* <p>{JSON.stringify(striked)}</p> */}

{(twoPlayers) ?
    <Arena>
    <Player transition={{type: 'spring', duration: 0.2}}>
        <CircleVideo onClick={() => {
          send({cmd: 'strike', props: {id: twoPlayers[0]}});
        }}>
          {video[0]}
        </CircleVideo>
    </Player>
      <Player whileTap={{x: [0, 5, -5, 0]}} transition={{type: 'spring', duration: 0.2}}>
        <CircleVideo onClick={() => {
          send({cmd: 'strike', props: {id: twoPlayers[1]}});
        }}>
          {video[1]}
        </CircleVideo>
      </Player>
    </Arena>

    :

    <div style={{color: 'white'}}>
      <h1>Guess Who am I?</h1>
      <p style={{width: '100%'}}>You become someone or something and each of you waits in line before you can ask question and expose your oponent.</p>
      <button onClick={iAmReady}>Let's guess!</button>
    </div>

}
  </Layout>
  </>
};



export default whoAmI;

const Layout = styled.div`
color: black;
height: 100%;
width: 50vw;
padding: 3rem;

background-color: #2D31FA;
background-size: 170px 170px;
background-repeat: repeat;

`

const Arena = styled.div`
  display: flex;
  position: relative;
  /* left: 50%;
  top: 50%;
  translate: -50% -50%; */
  flex-direction: column;
  width: max-content;

  position: relative;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
`

const CircleVideo = styled.div`
    position: relative;
    width: 17vw;
    height: 17vw;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;

    /* background-color: black; */
    /* border: 5px solid rgba(255, 255, 255, 1); */
    border: 7px solid black;
    overflow: hidden;
    cursor: pointer;


    .video{
      /* top: 50%; */
      left: 50%;
      position: absolute;
      translate: -50% 0;

    }
`