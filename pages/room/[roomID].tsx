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

  const { connect, isConnecting, room, error, participants, audioTracks } = useRoom(roomOptions);
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const [actTrans, setActTrans] = useState()


  interface EventInterface {
    type: string,
  }


  const actQuene = async (data: Transport, participantId?: string) => {
    // befoe sent -> added type of event
    const payload = encoder.encode(JSON.stringify({ type: 'actQuene', ...data }))
    await room.localParticipant.publishData(payload, DataPacket_Kind.RELIABLE)
  }

  //event handler of actQuene
  const actQueneHandler = ({cmd, props}) => {

    const cmds = {
      'start' : () => actQueneStart(props),
      'end' : () => {}, // more correct LEAVE
      'add' : () => {},
      'remove' : () => {}
    }
    
    return cmds[cmd]()
  }

  
  const actQueneStart= ({props}) => {
    // menu off
    click()
    
    // act()
    setActivity(list[props.id])    
    console.log('activity started', props)
    console.log(participants.map(p => p.sid));
  } 

  const actQueneAdd = ({props}) => {
    console.log('qAdd');
    
  }
  
  const actQueneRemove = ({}) => {
    console.log('qRemove');
    
  }




// event -> type of event
  const eventHandler = (data: object) => {
    // console.log(data);
    if (data.type === 'actTrans') {
      setActTrans(data)
    }
    if (data.type == 'actQuene') {

      const cmds = {
        'start': () => {
          setActivity(list[data.props.id])
        },
        'close': () => {
          setOpen(false)
        }
      }

      return cmds[data.cmd]()
    }
  }


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

    console.log(room?.localParticipant);

  }

  useEffect(() => {
    if (!tokenLoading) {
      init().catch(console.error)
    }
    console.log(tokenData);

  }, [tokenData])


  // From COL


  const [menu, setMenu] = useState(false)


  const taptap = (event, info) => {
    console.log(info.point.x, info.point.y)
  }

  const click = () => {
    (menu) ? menuAnim.start({minWidth: '100vw'}) : menuAnim.start({minWidth: '50vw'})
    setMenu(current => !current)
  }

  // const act = () => {
  //   menuAnim.start({minWidth: '50vw', right: 0})
  //   setMenu(current => !current)
  // }

  const menuAnim = useAnimationControls()


  //-------------------



  if (tokenLoading) return <p>Loading ...</p>
  if (tokenData?.error) return <div>{tokenData?.error}</div>



  return <Window>
    
    <div style={{ position: 'absolute', zIndex: 999 }}>
      <Exit onClick={async () => {await room.disconnect();router.push('/app')}}><img src="/img/exit.svg"/>Leave it here</Exit>

      <button onClick={() => click()}>Menu</button>

      {activity && activity.component(room, actTrans)}

      {/* <ParticipantView participant={room?.localParticipant} /> */}
      {/* {showChat && <MessageInput show autoFocus={true}/>} */}
    </div>


    <Playground animate={menuAnim} initial={{ minWidth: '100vw' }}>
      {menu && <Overlay onClick={() => click()} />}

             {audioTracks.map((t) => {
               <AudioRenderer track={t} isLocal={false} />
             })}


      <Coloseum total={participants.length}>
      {/* filter(p => p.sid != room?.localParticipant.sid) */}
          {participants.map((p, i) => (
            <ParticipantView participant={p} key={i} />
          ))}
      </Coloseum>

      {/* <TimeLine menu={menu} /> */}
    </Playground>


    <ActivityMenu>
      <div className="content">
        <header>
          <p>Settings</p>
          <p>Hide</p>
          <div style={{ marginRight: 'auto' }}></div>
          <Button>Copy shareable link</Button>
        </header>

        <ActivityLib>
          <section>
            <h2>Your favourite</h2>
            <div className="box">
              {
                Object.keys(list).map((a, i) =>
                  <ActivityThnail color={list[a].color} key={i}>
                    <Icon color={list[a].color} onClick={() => {actQuene({cmd: 'start',props: {id: a}}); actQueneStart({props: {id: a}})} } whileTap={{ scale: 0.7, opacity: 1, transition: { duration: 0.15 } }} onTapCancel={() => taptap} whileInView={{ opacity: 1 }} />
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
  </Window>

}

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
      <></>
    )
  }
  // user is not subscribed to track, for if using selective subscriptions
  if (!cameraPublication.isSubscribed) {
    return null;
  }

  return (
    <VideoRenderer track={cameraPublication.track} isLocal={isLocal} height={'100%'} className='video' />
  )
}





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
  margin: 20px;
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
      gap: 0;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
`

const Playground = styled(motion.section)`
      min-width: 100vw;
`

const ActivityMenu = styled.section`
      min-width: 50vw;
      color: rgba(255, 255, 255, 0.4);
      border-left: 1px solid rgba(128, 128, 128, 0.1);
      padding: 2rem;
      background: ${({ theme }) => theme.colors.white[100]};
      position: relative;
      overflow-y: scroll;

      
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


