// @ts-nocheck

import { Participant, DataPacket_Kind, Room, RoomEvent, RoomOptions, setLogLevel, VideoPresets, ParticipantEvent } from 'livekit-client';
import { AudioRenderer, DisplayContext, DisplayOptions, LiveKitRoom, useParticipant, useRoom, VideoRenderer } from '@livekit/react-components';

import { useState, useRef, useEffect, ReactElement } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext, NextPage } from 'next';
import Coloseum from '../../components/Coloseum';
import { createServerSupabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs';
import { useFetchToken } from '../../components/hooks/useFetchToken';
import { useUser } from '@supabase/auth-helpers-react';
import styled from 'styled-components';
import { activitiesList as list } from '../../components/acitivies/list';
import { motion, useAnimationControls } from 'framer-motion';
import { Button } from "../../components/sharedstyles";
import { type } from 'os';

import { FiGrid, FiChevronsRight, FiXOctagon, FiCamera, FiCameraOff, FiMic, FiMicOff } from "react-icons/fi";


// pokud neni uzivatel prihlasen -> login page a presmerovani zpet do room
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()


  if (!session)
    return {
      redirect: {
        destination: `/login?room=${ctx?.params.roomID}`,
        permanent: false,

      },
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}

// enum Event {
//   quene = "queneEvent",
//   video = "videoEvent",
//   voice = "voiceEvent",
//   chat = "chatEvent"
// }
type Event = "queneEvent" | "videoEvent" | "voiceEvent" | "chatEvent"




// livkekit options
const roomOptions: RoomOptions = {
  adaptiveStream: true,
  dynacast: true,
}

const RoomPage: NextPage = (req) => {

  const url = 'wss://livekit.krejci.email';
  const router = useRouter()
  const user = useUser();

  const { roomID, tokenQuery } = router.query
  const [tokenData, tokenError, tokenLoading] = useFetchToken(tokenQuery, user?.id, roomID || '')

  const [activity, setActivity] = useState(null)
  // include only in one state

  const { connect, isConnecting, room, error, participants, audioTracks } = useRoom(roomOptions);
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()


  const [layout, setLayout] = useState('full')
  const [menu, setMenu] = useState(false)

  const [activityParticipants, setActivityParticipants] = useState({videos: [], muted: []})




  const broadcast = async (type: Event, data: Transport, participantId?: string) => {
    // before sent -> added type of event
    const payload = encoder.encode(JSON.stringify({ type: type, ...data }))
    await room.localParticipant.publishData(payload, DataPacket_Kind.RELIABLE)
  }



  





// event -> type of event
  const eventHandler = (data) => {
    const events = {
      'queneEvent' : () => eventQueneHandler(data),
      'videoEvent' : () => eventVideoHandler(data),
      'voiceEvent' : () => eventVoiceHandler(data),
      'chatEvent' : () => {}
    }

    return events[data.type]()
  }


    //---- QUENE -----

  //event handler of actQuene
  const eventQueneHandler = ({cmd, props}) => {
    const cmds = {
      'start' : () => queneStart(props),
      'end' : () => queneEnd(props), // more correct LEAVE
      'add' : () => {},
      'remove' : () => {}
    }
    return cmds[cmd]()
  }

  const queneStart= (props) => {
    // menu off
    // menuView()
    setMenu(false)
    setActivity({channel: props.channel, ...list[props.id]})
    setLayout('v-right')
    
    console.log('activity started', props)
  }

  const queneEnd = () => {
    setActivity(null);
    setLayout('full')
  }



  //---- VIDEO -----

  const eventVideoHandler = ({cmd, props}) => {
    const cmds = {
      'get' : () => videoGet(props),
      'letgo' : () => videoLetgo(props),
    }
    return cmds[cmd]()
  }

  const videoGet = (ids) => {    
    // setActivityParticipants({...activityParticipants, videos: [...activityParticipants.videos, ...ids.filter(id => !activityParticipants.videos.includes(id))] })
    setActivityParticipants({...activityParticipants, videos: [...ids] })
    return ids.map((id,i) => <ParticipantView participant={participants.find(p => p.sid === id)} key={i} />)
  }


  const videoLetgo = (ids) => {
    console.log('in let go functin', ids);
    
    setActivityParticipants({...activityParticipants, videos: [...activityParticipants.videos.filter(id => !ids.includes(id))] })
  }






// called to initiate livekit connection & listening events
  const init = async () => {
    // console.log('token ->', tokenData?.token);

    await connect(url, tokenData?.token);
    // request camera and microphone permissions and publish tracks
    await room.localParticipant.enableCameraAndMicrophone();

    console.log(room);
    console.log(participants.sid);
    

    room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
      const data = decoder.decode(payload);
      eventHandler(JSON.parse(data))
      return
    })
  }

  useEffect(() => {
    if (!tokenLoading) {
      init().catch(console.error)
    }
    console.log(tokenData);
  }, [tokenData])




  const menuView = () => {
    // (menu) ? menuAnim.start({minWidth: '100vw'}) : menuAnim.start({minWidth: '50vw'})
    menu ? setLayout('full') : setLayout('v-right'); 
    setMenu(current => !current)    
  }

  const startActivity = async (id) => {
    const chname = Date.now()

    // await setActivity({channel: chname})

    queneStart({id: id, channel: chname})
    broadcast('queneEvent', {cmd: 'start', props:{id: id, channel: chname}})

    const link = ['http://localhost:3333/activity', 'https://jazzed-moon-production.up.railway.app/activity', 'http://192.168.88.253:3333/activity']
    fetch(link[1], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({activity: id, channel: chname, players: [...participants.map(p => p.sid)]}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }

  // const act = () => {
  //   menuAnim.start({minWidth: '50vw', right: 0})
  //   setMenu(current => !current)
  // }
  // const menuAnim = useAnimationControls()


  //-------------------

  const [inputs, setInputs] = useState({mic: true, cam: true})

  const enableCam = () => {
    room?.localParticipant.setCameraEnabled(room?.localParticipant.isCameraEnabled ? false : true)
    setInputs({...inputs, cam: !inputs.cam})
  }

  const enableMic = () => {
    room?.localParticipant.setMicrophoneEnabled(room?.localParticipant.isMicrophoneEnabled ? false : true)
    setInputs({...inputs, mic: !inputs.mic})
  }


  if (tokenLoading) return <p>Loading ...</p>
  if (tokenData?.error) return <div>{tokenData?.error}</div>

  return <Window layout={layout}>
    
    <div style={{ position: 'fixed', display: 'flex', zIndex: 999, top: 0, left: 0 }}>
      <Exit onClick={async () => {await room.disconnect();router.push('/app')}}><img src="/img/exit.svg"/>Leave it here</Exit>
     {activity && <Exit onClick={() => {broadcast('queneEvent', {cmd: 'end'}); queneEnd()}} style={{color: 'gray'}}>Stop activity <FiXOctagon/></Exit>}

     <Exit onClick={() => enableCam()} style={{color: 'gray'}}>{inputs.cam ? <FiCamera/> : <FiCameraOff/>}</Exit>
     <Exit onClick={() => enableMic()} style={{color: 'gray', marginLeft: '0.3rem'}}>{inputs.mic ? <FiMic/> : <FiMicOff/>}</Exit>
     {/* <p onClick={() => console.log(room.localParticipant.isCameraEnabled)}>{room.localParticipant.isCameraEnabled}ppp</p> */}
      {/* <ol>
        {participants.map((p,i) => <li key={i}>{p.sid}</li>)}
      </ol>

      <p>got videos</p>
      <ol>
        {activityParticipants.videos.map((p,i) => <li key={i}>{p}</li>)}
      </ol> */}

      {/* <ol>
        {audioTracks.map(a => <li>{JSON.stringify(a)}</li>)}
      </ol> */}

      {/* <p>{JSON.stringify(activity)}</p> */}
      {/* {showChat && <MessageInput show autoFocus={true}/>} */}
    </div>

{/* animate={menuAnim} initial={{ minWidth: '100vw' }} */}

{ (!activity && !menu) ?
   <MenuBtn onClick={() => menuView()}>
      <FiGrid/>
    </MenuBtn>
    : null
}

    <Playground layout={layout} >

      {menu && <Overlay onClick={() => menuView()} />}

             {audioTracks.map((t) => {
               <AudioRenderer track={t} isLocal={false} />
             })}


      {/* filter(p => p.sid != room?.localParticipant.sid)  */}
      <Coloseum total={participants.length-activityParticipants.videos.length}>
          {participants.filter(p => !activityParticipants.videos.includes(p.sid)).map((p, i) => 
            <div key={i}>
              {/* <p>-------------{p.isSpeaking && 'ano'}</p> */}
            <ParticipantView participant={p} />
            </div>
          )}
      </Coloseum>

    </Playground>


    <Activity>
      {/* {activity && activity.component(room, actTrans, participants.filter().map((p, i) => <ParticipantView participant={p} key={i}/>))} */}
      {/* {activity && activity.component(room, actTrans, participants.map((p, i) => <ParticipantView participant={p} key={i}/>))} */}
      {/* {activity && activity.component(room, actTrans, participants.reduce((obj, cur) => ({...obj, [cur.sid]: <CircleVideo><ParticipantView participant={cur} key={cur.sid}/></CircleVideo> }), {'ids': [...participants.map(p => p.sid)]}))} */}
      {/* {activity && activity.component( {activity: activity.id, channel: 'notfullyrandomstring', players: [...participants.map(p => p.sid)]} ,participants.filter(p => p.sid === activityParticipants.videos.includes(p)).map((obj, cur) => ({...obj, [cur.sid]: <CircleVideo><ParticipantView participant={cur} key={cur.sid}/></CircleVideo> })))} */}
      {/* {activity && activity.component( {activity: activity.id, channel: 'notfullyrandomstring', players: [...participants.map(p => p.sid)]}, participants.filter(p => p.sid === activityParticipants.videos.includes(p)).map((obj, cur) => ({...obj, [cur.sid]: <CircleVideo><ParticipantView participant={cur} key={cur.sid}/></CircleVideo>}))  )} */}
      {activity && activity.component( {activity: activity.id, channel: activity.channel, players: [...participants.map(p => p.sid)]}, videoGet, videoLetgo )}
    </Activity>



{ menu &&
    <ActivityMenu>
      <div className="content">
        <header>
          <Exit onClick={() => menuView()} style={{color: 'gray', margin: 0}}>
            <FiChevronsRight/>
          </Exit>
          <p>Settings</p>
          <div style={{ marginRight: 'auto' }}></div>
          {/* <Button>Copy shareable link</Button> */}
          <Exit onClick={() => {navigator.clipboard.writeText(`https://canpit.krystof.ml/room/${roomID}`)}} style={{color: 'gray', margin: 0}}>Copy shareable link</Exit>
        </header>

        <ActivityLib>
          <section>
            <h2>New</h2>
            <div className="box">
                  <ActivityThnail color={list['onlyQuestions'].color}>
                    <Icon color={list['onlyQuestions'].color} onClick={() => {startActivity(list['onlyQuestions'].id)} } whileTap={{ scale: 0.7, opacity: 1, transition: { duration: 0.15 } }} whileInView={{ opacity: 1 }} />
                    <h3>{list['onlyQuestions'].title}</h3>
                    <p>{list['onlyQuestions'].desc.substring(0, 32)}...</p>
                  </ActivityThnail>

                  <ActivityThnail color='gray'>

                  </ActivityThnail>

                  {/* <ActivityThnail color='gray'>
                  </ActivityThnail> */}
                  
            </div>
          </section>
          <section>
            <h2>Comming soon</h2>
            <div style={{opacity: 0.2}} className="box">
              {
                Object.keys(list).map((a, i) =>
                  <ActivityThnail color={list[a].color} key={i}>
                    <Icon color={list[a].color} whileTap={{ scale: 0.7, opacity: 1, transition: { duration: 0.15 } }} whileInView={{ opacity: 1 }} />
                    <h3>{list[a].title}</h3>
                    <p>{list[a].desc.substring(0, 32)}...</p>
                  </ActivityThnail>
                )
              }
            </div>
          </section>
        </ActivityLib>
      </div>
    </ActivityMenu>
}

  </Window>

}

// export const videoGet = (participants,id: number) => {

//   return <ParticipantView participant={participants.find(p => p.sid === id)} key={i} />

// }

export default RoomPage




interface ParticipantViewProps {
  participant: Participant
}

  const ParticipantView = ({ participant }: ParticipantViewProps): ReactElement | null => {
  // isSpeaking, connectionQuality will update when changed
  const { isSpeaking, connectionQuality, isLocal, cameraPublication } = useParticipant(participant)
  

  // user has disabled video
  if (cameraPublication?.isMuted ?? true) {
    // render placeholder view
    return (
      <FiCameraOff style={{position: 'absolute',
      left: '50%',
      translate: '-50% -50%',
      top: '50%',
      width: '30%',
      height: '30%'}}/>
    )
  }
  // user is not subscribed to track, for if using selective subscriptions
  if (!cameraPublication.isSubscribed) {
    return null;
  }

  // if(isSpeaking){
  //   return <p>Mluvi hahaha</p>
  // }

  return (
    <VideoRenderer track={cameraPublication.track} isLocal={isLocal} height={'100%'} className='video' />
  )
}






const Activity = styled.div`
  height: 100%;
  width: 100%;
  background: white;
`

const Exit = styled.button`
  font-family: inherit;
  /* background-color: ${({ theme }) => theme.colors.secondary}; */
  background-color: transparent;
  width: max-content;
  padding: 6px 10px 7px 10px;
  /* padding: 12px 20px; */
  font-weight: 500;
  border-radius: 7px;
  /* line-height: 16px; */
  letter-spacing: .2px;
  font-size: 1rem;
  border: none;
  /* border: 2px solid ${({ theme }) => theme.colors.white[100]}; */

  display: flex;
  gap: 10px;
  align-items: center;
  transition: all 200ms;
  margin: 20px 0 20px 20px;
  color: rgba(38, 148, 99, 0.5);

  img{
        height: 24px;
    }

  &:hover {
      color: white;
      background-color: ${({ theme }) => theme.colors.white[200]};
    cursor: pointer;
  } 
  &:active {

  }
`

const MenuBtn = styled.div`
  font-family: inherit;
  /* background-color: ${({ theme }) => theme.colors.secondary}; */
  background-color: transparent;
  position: absolute;
  height: calc(100% - 40px);
  width: max-content;
  padding: 6px 10px 7px 10px;
  /* padding: 12px 20px; */
  font-weight: 500;
  border-radius: 7px;
  /* line-height: 16px; */
  letter-spacing: .2px;
  font-size: 1rem;
  border: none;
  /* border: 2px solid ${({ theme }) => theme.colors.white[100]}; */

  display: flex;
  gap: 10px;
  align-items: center;
  transition: all 200ms;
  margin: 20px;
  padding: 40px;
  color: gray;

  div{
        height: 24px;
        width: 24px;
    }

  &:hover {
      color: white;
      background-color: ${({ theme }) => theme.colors.white[200]};
    cursor: pointer;
  } 
  &:active {

  }
`


// --------- Col components ----------

enum ColorType {
  bg = 20,
  border = 15,
  title = 70,
  text = 45,
  overlay= 60
}


const colorShade = (color: any, type: ColorType) => {
  const colour = color.charAt(0) === "#" ? color.substring(1, 7) : color;

  const r = parseInt(colour.substring(0, 2), 16); // hexToR
  const g = parseInt(colour.substring(2, 4), 16); // hexToG
  const b = parseInt(colour.substring(4, 6), 16); // hexToB

  if(type === ColorType.title){
    return '#' +
    ((0|(1<<8) + r + (256 - r) * type / 100).toString(16)).substr(1) +
    ((0|(1<<8) + g + (256 - g) * type / 100).toString(16)).substr(1) +
    ((0|(1<<8) + b + (256 - b) * type / 100).toString(16)).substr(1);
  }


  return `rgba(${r},${g},${b}, ${type/100})`
};


const CircleVideo = styled(motion.div)`
    position: absolute;
    left: 50%;
    top: 50%;
    width: 200px;
    height: 200px;
    translate: -50% -50%;
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



const Overlay = styled.div`
  position: absolute;
  width: 50vw;
  height: 100%;
  z-index: 2;
  /* background-color: ${colorShade('#00000', ColorType.overlay)}; */
  /* background-color: ${({ theme }) => theme.colors.black['300']}; */
  background-color: #15130ed4;
`


interface Props {
    show: boolean
  }


const ActivityLib = styled.div`
    section{
      /* overflow: scroll; */

    }

    .box{

      display: flex;
      flex-direction: row;
      /* gap: 10px; */
      /* gap: auto; */
      gap: 2rem;

      justify-content: space-between;
      flex-wrap: wrap;
      /* align-items: right; */

      /* flex-shrink: 3; */

      max-width: calc(50vw - 4em);
      /* height: 1200px; */


    
    }
`

const ActivityThnail = styled.div`

      min-width: 220px;
      /* max-width: 250px; */
      flex: 3 3 30%;
      /* width: 33%; */
      /* height: 180px; */
      /* height: 160px; */
      border: 2px solid ${props => colorShade(props.color, ColorType.border)};
      border-radius: 24px;
      /* border-radius: 18px; */
      padding: 14px 14px 14px 14px;
      box-sizing: border-box;
      background-color: ${props => colorShade(props.color, ColorType.bg)};
      transition: all 200ms;
      /* color: ${props => props.color}; */
      color: ${props => colorShade(props.color, ColorType.text)};
      
      &:hover{
        /* border: 2px solid ${({ theme }) => theme.colors.white[200]}; */
        border-color: transparent;
        background-color: ${props => colorShade(props.color, ColorType.text)};
        
      }
      
      h3{
        color: ${props => colorShade(props.color, ColorType.title)};
        font-size: 18px;
        font-weight: normal;
      }
    

    .icon{
      height: 80px;
      width: 80px;
      background-color: ${props => props.color};
      border-radius: 10px;
      cursor: pointer;
    }
`

const Icon = styled(motion.div)`
      height: 80px;
      width: 80px;
      background-color: ${props => props.color};
      border-radius: 10px;
      cursor: pointer;

      /* {position: 'absolute', top: '50%', left: '50%', transform: 'translate(calc(-25vw - 50%), -50%)' } */

`

const Window = styled.div`
      margin: 0;
      padding: 0;
      display: flex;
      /* flex-direction: ${props => (props.layout.slice('-')[0] === 'h') ? (props.layout.slice('-')[1] === 'down') ? 'column': 'column-reverse' : (props.layout.slice('-')[1] === 'right') ? 'row' : 'row-reverse'}; */
      flex-direction: ${ props => {
        const par = props.layout.split('-')

        if(par[0] === 'h'){
          console.log(par);
          console.log((par[1] === 'down') ? 'column': 'column-reverse');
          
          
          return (par[1] === 'down') ? 'column': 'column-reverse'
        }

        return (par[1] === 'right') ? 'row' : 'row-reverse'
        
      }};
      gap: 0;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      /* background: brown; */
`

const Playground = styled.section`
      min-width: ${props => (props.layout[0] === 'v') ? '50vw' : '100vw'};
      height: ${props => (props.layout[0] === 'v' | props.layout === 'full') ? '100vh' : '50vh'};
      /* background: blue; */
`

const ActivityMenu = styled.section`
      min-width: 50vw;
      color: rgba(255, 255, 255, 0.4);
      border-left: 1px solid rgba(128, 128, 128, 0.1);
      padding: 2rem;
      background: ${({ theme }) => theme.colors.white[100]};
      position: relative;
      /* overflow-y: scroll; */

      
      .content{
        /* width: 50vw; */

      }

      h2{
        font-weight: normal;
        font-size: 1.2rem;
        color: rgba(255, 255, 224, 0.4);

      }


      /* border-top-left-radius: 20px;
      border-bottom-left-radius: 20px; */
      /* background-color: red; */

      header{
          display: flex;
          flex-direction: row;
          gap: 16px;
          align-items: center;
          margin-bottom: 4rem;
      }
`

const MessageInput = styled.textarea<Props>`
    // display: ${props => !props.show ? 'block' : 'none'};
    background: ${({ theme }) => theme.colors.white[200]};
    border: 2px solid ${({ theme }) => theme.colors.white[300]};
    color: white;
    font-family: inherit;
    padding: 6px 10px 7px 10px;
    font-size: 1rem;
    border-radius: 7px;
    outline: none;
    transition: all 200ms;

    &::-webkit-scrollbar {
    width: 1em;
    display: none;
    }

    /* &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }

    &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
    } */
    
    
    &:hover{
        background: ${({ theme }) => theme.colors.white[100]};     
    }
    
    &:focus, :active{
        border-color: ${({ theme }) => theme.colors.primary};
        background: ${({ theme }) => theme.colors.white[200]};
    }
`


