import { faSquare, faThLarge, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Room, RoomEvent, setLogLevel, VideoPresets } from 'livekit-client';
import { DisplayContext, DisplayOptions, LiveKitRoom } from '@livekit/react-components';
import '@livekit/react-components/dist/index.css';

import { useEffect, useRef, useState } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
// import { useNavigate, useLocation } from 'react-router-dom';
import Router from 'next/router';
import {useRouter} from 'next/router';
import { NextPage } from 'next';
import { useUser } from '@supabase/auth-helpers-react';

// import Database from 'better-sqlite3';
// const db = new Database('./pages/api/db/rooms.db');

// const roomExist = db.prepare('select 1 from rooms where roomId = ?');
// export const getServerSideProps = (req) => {
//   const { roomId } = req.query

//   if(!roomExist.run(roomId)){

//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   return

// } 



const RoomPage: NextPage = (req) => {
  const [numParticipants, setNumParticipants] = useState(0);
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    stageLayout: 'grid',
    showStats: false,
  });

  const router = useRouter()
  const user = useUser();

  const { roomId, tokenQuery } = router.query



  

  const nameRef = useRef(null);
  const [data, setData] = useState({})

  const [token, setToken] = useState(tokenQuery)


  const [userName, setUserName] = useState<string>((user) ? user?.user_metadata.full_name : undefined )

  
  useEffect(() => {
    if(!user && userName){
      fetch('/api/room',{ method: 'post', headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}, body: JSON.stringify({userName: userName, roomId: roomId})})
      .then((res) => res.json())
      .then((data) => {
        console.log(data);  
        setToken(data.token)      
      })
    }
  }, [userName])


  const onFormSubmit = (event) => {
    event.preventDefault()
    setUserName(nameRef.current.value)

    event.target.reset();

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


  const url = 'wss://livekit.krejci.email';

  
  const query = new URLSearchParams('http://localhost:3000/room/room?url=wss%3A%2F%2Flivekit.krejci.email&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkyNjQyMzksImlzcyI6IkFQSXlCdG9lcE5hdHNqeSIsImp0aSI6InRvbnlfc3RhcmsiLCJuYW1lIjoiVG9ueSBTdGFyayIsIm5iZiI6MTY2MzI2NDIzOSwic3ViIjoidG9ueV9zdGFyayIsInZpZGVvIjp7InJvb20iOiJzdGFyay10b3dlciIsInJvb21Kb2luIjp0cnVlfX0.5tqBfRrUHHsdMkA5kFGQMYRAzeNkvz3f7t7oOBsdP0c&videoEnabled=1&audioEnabled=1&simulcast=1&dynacast=1&adaptiveStream=1&videoDeviceId=240092b45667532940b32497114f7a559a9652f96cdff794c3049ac286ae8e41');
  const recorder = query.get('recorder');

  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6InZmZC1ucGItaGdrIn0sImlhdCI6MTY2NTUxOTMyMCwibmJmIjoxNjY1NTE5MzIwLCJleHAiOjE2NjU1NDA5MjAsImlzcyI6IkFQSXlCdG9lcE5hdHNqeSIsInN1YiI6ImtrcnlzdG9mIiwianRpIjoia2tyeXN0b2YifQ.zUo1SRaujcBjwMI3zoJ9Lms_eqvPfa33UvBtsUMTC2Y';

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

  const updateOptions = (options: DisplayOptions) => {
    setDisplayOptions({
      ...displayOptions,
      ...options,
    });
  };

  return (
    <DisplayContext.Provider value={displayOptions}>
      <div className="roomContainer">
        <div className="topBar">
          <h2>VideoChat - {roomId}</h2>
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
                disabled={displayOptions.stageLayout === 'grid'}
                onClick={() => {
                  updateOptions({ stageLayout: 'grid' });
                }}
              >
                <FontAwesomeIcon height={32} icon={faThLarge} />
              </button>
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
    </DisplayContext.Provider>
  );
};

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


export default RoomPage