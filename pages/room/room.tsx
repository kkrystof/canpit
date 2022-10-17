import { Participant, Room, RoomEvent, setLogLevel, VideoPresets } from 'livekit-client';
import { AudioRenderer, DisplayContext, DisplayOptions, LiveKitRoom, useParticipant, useRoom, VideoRenderer } from '@livekit/react-components';


import { useState, useRef, useEffect, ReactElement } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
import {useRouter} from 'next/router';
import { NextPage } from 'next';
import Coloseum from '../../components/Coloseum';

const RoomPage: NextPage = (req) => {


  const router = useRouter()
  const [data, setData] = useState({})

  
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6ImpnYS1nbm0tdGtvIn0sImlhdCI6MTY2NjAzNTczNywibmJmIjoxNjY2MDM1NzM3LCJleHAiOjE2NjYwNTczMzcsImlzcyI6IkFQSXlCdG9lcE5hdHNqeSIsInN1YiI6ImVjZTMzODQ1LTRiYWYtNGRlMi04YjA2LTk4MDc1NDMwMWM2NCIsImp0aSI6ImVjZTMzODQ1LTRiYWYtNGRlMi04YjA2LTk4MDc1NDMwMWM2NCJ9.HKgkAaM6eLXNvsMW7m4NScoh4-zUYUy8wdyaVS7JEtI"
  const url = 'wss://livekit.krejci.email';


  const roomOptions: RoomOptions = {
    adaptiveStream: true,
    dynacast: true,
  }


  const { connect, isConnecting, room, error, participants, audioTracks } = useRoom(roomOptions);

  async function init() {
    // initiate connection to the livekit room
    await connect(url, token);
    // request camera and microphone permissions and publish tracks
    await room.localParticipant.enableCameraAndMicrophone();
    console.log(participants);
    
  }

  useEffect(() => {
    init().catch(console.error)
  }, [])



  return <>
          <div style={{position: 'absolute'}}>
            <h2>Own Room</h2>
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
    <VideoRenderer track={cameraPublication.track} isLocal={isLocal} height={'100%'} width={'100%'}  />
  )
}




