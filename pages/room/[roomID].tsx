// @ts-nocheck

import { Participant, DataPacket_Kind, Room, RoomEvent, RoomOptions, setLogLevel, VideoPresets, ParticipantEvent } from 'livekit-client';
import { AudioRenderer, DisplayContext, DisplayOptions, LiveKitRoom, useParticipant, useRoom, VideoRenderer } from '@livekit/react-components';

import { useState, useRef, useEffect, ReactElement } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
import {useRouter} from 'next/router';
import { GetServerSidePropsContext, NextPage } from 'next';
import Coloseum from '../../components/Coloseum';
import { createServerSupabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs';
import { useFetchToken } from '../../components/hooks/useFetchToken';
import { useUser } from '@supabase/auth-helpers-react';
import styled from 'styled-components';
import WhoAmI from '../../components/acitivies/WhoAmI';
import { activitiesList } from '../../components/acitivies/list';

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


  const sent = async () => {
    const strData = {number: Math.floor(Math.random() * 10), text: 'Why is this happening to me, why it is not just working as it shloud be, tell me'}

    const data = encoder.encode(strData);
    // participants.map(p => console.log(p.sid))

    await room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
    return

  }

  interface EventInterface {
    type: string,
  }

  const initEvent = async (data) => {
    const payload = encoder.encode(JSON.stringify(data))
    await room.localParticipant.publishData(payload, DataPacket_Kind.RELIABLE)
  }

  const actQuene = async (data: Transport, participantId?: string) => {
    // befoe sent -> added type of event
    const payload = encoder.encode(JSON.stringify({type: 'actQuene', ...data}))
    await room.localParticipant.publishData(payload, DataPacket_Kind.RELIABLE)
    setActivity(activitiesList[data.props.id])
  }

  const eventHandler = (data: object) => {
    // console.log(data);
    if(data.type === 'actTrans'){
      setActTrans(data)
    }
    if(data.type == 'actQuene'){

      const cmds = {
        'start' : () => {
          setActivity(activitiesList[data.props.id])
        },
        'close' : () => {
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

    room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
      const data = decoder.decode(payload);
      eventHandler(JSON.parse(data))
      return
    })

    console.log(room?.localParticipant);
    
  }

  useEffect(() => {
    if(!tokenLoading){
      init().catch(console.error)
    }
    console.log(tokenData);
    
  }, [tokenData])


  if(tokenLoading) return <p>Loading ...</p> 
  if (tokenData?.error) return <div>{tokenData?.error}</div>

  return <>
          <div style={{position: 'absolute', zIndex: 999}}>
            <button onClick={() => sent()}>SENT data</button>
            <Exit onClick={async () => {await room.disconnect();router.push('/app')}}><img src="/img/exit.svg"/>Leave it here</Exit>
            <p>{tokenData?.roomId}</p>
            {/* <p>{DataReceived}</p> */}
            <button onClick={() => actQuene({cmd: 'start',props: {id: 'clickClick'}})}>ClickClick</button>
            <button onClick={() => actQuene({cmd: 'start',props: {id: 'whoAmI'}})}>Who am I</button>

            {activity && activity.component(room, actTrans)}

          </div>

          <div style={{height: '100vh'}}>

          {audioTracks.map((t) => {
            <AudioRenderer track={t} isLocal={false} />
          })}

          <Coloseum total={participants.length}>

            {participants.map((p,i) => (
              <ParticipantView participant={p} key={i}/>
            ))}

          </Coloseum>
          </div>
  </>
  ;
};

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
    <VideoRenderer track={cameraPublication.track} isLocal={isLocal} height={'100%'} className='video'/>
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

