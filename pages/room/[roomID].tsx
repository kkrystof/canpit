// @ts-nocheck

import { Participant, Room, RoomEvent, RoomOptions, setLogLevel, VideoPresets } from 'livekit-client';
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

// export const getServerSideProps = withPageAuth({ redirectTo: '/login' })

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


const RoomPage: NextPage = (req) => {

  const router = useRouter()
  const [data, setData] = useState({})
  const user = useUser();

  const { roomID, tokenQuery } = router.query


const [tokenData, tokenError, tokenLoading] = useFetchToken(user?.id, roomID || '')

  
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6ImpnYS1nbm0tdGtvIn0sImlhdCI6MTY2NjAzNTczNywibmJmIjoxNjY2MDM1NzM3LCJleHAiOjE2NjYwNTczMzcsImlzcyI6IkFQSXlCdG9lcE5hdHNqeSIsInN1YiI6ImVjZTMzODQ1LTRiYWYtNGRlMi04YjA2LTk4MDc1NDMwMWM2NCIsImp0aSI6ImVjZTMzODQ1LTRiYWYtNGRlMi04YjA2LTk4MDc1NDMwMWM2NCJ9.HKgkAaM6eLXNvsMW7m4NScoh4-zUYUy8wdyaVS7JEtI"
  const url = 'wss://livekit.krejci.email';


  const roomOptions: RoomOptions = {
    adaptiveStream: true,
    dynacast: true,
  }


  const { connect, isConnecting, room, error, participants, audioTracks } = useRoom(roomOptions);

  room.on(RoomEvent.ParticipantConnected, () => console.log('hey welcome', room));


  const init = async () => {
    // initiate connection to the livekit room
    console.log('token ->', tokenData?.token);
    
    await connect(url, tokenData?.token);
    // request camera and microphone permissions and publish tracks
    await room.localParticipant.enableCameraAndMicrophone();
    console.log(participants);
    
  }

  useEffect(() => {
    if(!tokenLoading){

      init().catch(console.error)
    }
    console.log(tokenData);
    
  }, [tokenData])


  if(tokenLoading){
    return <p>Loading ...</p>
  }

  if (tokenData?.error) return <div>{tokenData?.error}</div>


  // return (<p>in call</p>)

  return <>
          <div style={{position: 'absolute'}}>
            <Exit onClick={async () => {await room.disconnect();router.push('/app')}}><img src="/img/exit.svg"/>Leave it here</Exit>
            <p>{tokenData?.roomId}</p>

          </div>

          <div style={{height: '100vh'}}>

          {audioTracks.map((t) => {
            <AudioRenderer track={t} isLocal={false} />
          })}

          <Coloseum total={participants.length}>

          {participants.map((p) => (
            <ParticipantView participant={p} />
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

