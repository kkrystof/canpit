import { faSquare, faThLarge, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { Room, RoomEvent, setLogLevel, VideoPresets } from 'livekit-client';
import { AudioRenderer, DisplayContext, DisplayOptions, LiveKitRoom, useParticipant, useRoom, VideoRenderer } from '@livekit/react-components';


import { useState, useRef, useEffect } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
// import { useNavigate, useLocation } from 'react-router-dom';
import Router from 'next/router';
import {useRouter} from 'next/router';
import { NextPage } from 'next';
import { getData } from '../api/room';
import Coloseum from '../../components/Coloseum';

const RoomPage: NextPage = (req) => {
  const [numParticipants, setNumParticipants] = useState(0);
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    stageLayout: 'grid',
    showStats: false,
  });

  const router = useRouter()
  const { roomId } = router.query

  const [data, setData] = useState({})
  const [isLoading, setLoading] = useState(false)

  const nameRef = useRef(null);

  const [userName, setUserName] = useState<string>()

  
  useEffect(() => {
    if(userName){
    setLoading(true)
    fetch('/api/room',{ method: 'post', headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify({userName: userName, roomId: roomId})})
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
    }
  }, [userName])

  const getToken = () => {
  }

  const onFormSubmit = (event) => {
    event.preventDefault()
    setUserName(nameRef.current.value)

    getToken()
    event.target.reset();

    // send state to server with e.g. `window.fetch`
  }

  if(!userName){
    return <>
      <h2>Before you connect to room - {roomId}</h2>      
      <form onSubmit={onFormSubmit}>
      <label htmlFor="">Username</label>
      <input type="text" ref={nameRef}/>
        <button type="submit">Connect</button>
      </form>
    </>
  }


  let token = data.token || undefined



  
  const query = new URLSearchParams('http://localhost:3000/room/room?url=wss%3A%2F%2Flivekit.krejci.email&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkyNjQyMzksImlzcyI6IkFQSXlCdG9lcE5hdHNqeSIsImp0aSI6InRvbnlfc3RhcmsiLCJuYW1lIjoiVG9ueSBTdGFyayIsIm5iZiI6MTY2MzI2NDIzOSwic3ViIjoidG9ueV9zdGFyayIsInZpZGVvIjp7InJvb20iOiJzdGFyay10b3dlciIsInJvb21Kb2luIjp0cnVlfX0.5tqBfRrUHHsdMkA5kFGQMYRAzeNkvz3f7t7oOBsdP0c&videoEnabled=1&audioEnabled=1&simulcast=1&dynacast=1&adaptiveStream=1&videoDeviceId=240092b45667532940b32497114f7a559a9652f96cdff794c3049ac286ae8e41');
  // const url = query.get('url');
  // const token = query.get('token');

  const url = 'wss://livekit.krejci.email';
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6InZmZC1ucGItaGdrIn0sImlhdCI6MTY2NTUxOTMyMCwibmJmIjoxNjY1NTE5MzIwLCJleHAiOjE2NjU1NDA5MjAsImlzcyI6IkFQSXlCdG9lcE5hdHNqeSIsInN1YiI6ImtrcnlzdG9mIiwianRpIjoia2tyeXN0b2YifQ.zUo1SRaujcBjwMI3zoJ9Lms_eqvPfa33UvBtsUMTC2Y';
  //             eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6InZmZC1ucGItaGdrIn0sImlhdCI6MTY2NTUxOTc4MSwibmJmIjoxNjY1NTE5NzgxLCJleHAiOjE2NjU1NDEzODEsImlzcyI6IkFQSXlCdG9lcE5hdHNqeSIsInN1YiI6ImtrcnlzdG9mIiwianRpIjoia2tyeXN0b2YifQ.rh_ii87YLOp4mV-s7SqnOFFwg9xgGjBw6n5R0v-_tA0
  const recorder = query.get('recorder');

  if (!url || !token) {
    return <div>url and token are required</div>;
  }







  const onLeave = () => {
    Router.push('/');
  };

  const updateParticipantSize = (room: Room) => {
    setNumParticipants(room.participants.size + 1);
  };

  const onParticipantDisconnected = (room: Room) => {
    updateParticipantSize(room);

    /* Special rule for recorder */
    if (recorder && parseInt(recorder, 10) === 1 && room.participants.size === 0) {
      console.log('END_RECORDING');
    }
  };


  // const updateOptions = (options: DisplayOptions) => {
  //   setDisplayOptions({
  //     ...displayOptions,
  //     ...options,
  //   });
  // };


  return (
      <div className="roomContainer">
        <div className="topBar">
          <h2>LiveKit Video</h2>
          <p>{roomId}</p>
          <div className="right">
            <div>
              <input
                id="showStats"
                type="checkbox"
                onChange={(e) => updateOptions({ showStats: e.target.checked })}
              />
              <label htmlFor="showStats">Show Stats</label>
            </div>
            <div>


              <button
                className="iconButton"
                disabled={displayOptions.stageLayout === 'speaker'}
                onClick={() => {
                  updateOptions({ stageLayout: 'speaker' });
                }}
              >
                <FontAwesomeIcon height={32} icon={faSquare} />
              </button>
            </div>
            <div className="participantCount">
              <FontAwesomeIcon icon={faUserFriends} />
              <span>{numParticipants}</span>
            </div>
          </div>
        </div>
        <LiveKitRoom
          url={url}
          token={token}
          onConnected={(room) => {
            setLogLevel('debug');
            onConnected(room, query);
            room.on(RoomEvent.ParticipantConnected, () => updateParticipantSize(room));
            room.on(RoomEvent.ParticipantDisconnected, () => onParticipantDisconnected(room));
            updateParticipantSize(room);
          }}
          stageRenderer={Coloseum}
          roomOptions={{
            adaptiveStream: isSet(query, 'adaptiveStream'),
            dynacast: isSet(query, 'dynacast'),
            publishDefaults: {
              simulcast: isSet(query, 'simulcast'),
            },
            videoCaptureDefaults: {
              resolution: VideoPresets.h720.resolution,
            },
          }}
          onLeave={onLeave}
        />
      </div>
  );
};



// const Stage = () => {
//   const { room, isConnecting, participants, audioTracks } = useRoom({
//     adaptiveStream: true,
//     dynacast: true,
//   })

//   return (
//     <>
//     <div>

//       {audioTracks.map((t) => {
//         <AudioRenderer track={t} isLocal={false} />
//       })}

//       {participants.map((p) => (
//         <ParticipantView participant={p} />
//       ))}
//     </div>
//     </>
//   )
// }

// interface ParticipantViewProps {
//   participant: Participant
// }

// const ParticipantView = ({ participant }: ParticipantViewProps): ReactElement | null => {
//   // isSpeaking, connectionQuality will update when changed
//   const { isSpeaking, connectionQuality, isLocal, cameraPublication } = useParticipant(participant)

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
//     <VideoRenderer track={cameraPublication.track} isLocal={isLocal} />
//   )
// }


async function onConnected(room: Room, query: URLSearchParams) {
  // make it easier to debug
  (window as any).currentRoom = room;

  if (isSet(query, 'audioEnabled')) {
    const audioDeviceId = query.get('audioDeviceId');
    if (audioDeviceId && room.options.audioCaptureDefaults) {
      room.options.audioCaptureDefaults.deviceId = audioDeviceId;
    }
    await room.localParticipant.setMicrophoneEnabled(true);
  }

  if (isSet(query, 'videoEnabled')) {
    const videoDeviceId = query.get('videoDeviceId');
    if (videoDeviceId && room.options.videoCaptureDefaults) {
      room.options.videoCaptureDefaults.deviceId = videoDeviceId;
    }
    await room.localParticipant.setCameraEnabled(true);
  }
}

function isSet(query: URLSearchParams, key: string): boolean {
  return query.get(key) === '1' || query.get(key) === 'true';
}


// export async function getServerSideProps(name: string, id: string) {
//   const jsonData = await getData(name, id)
//   return jsonData
// }


export default RoomPage


