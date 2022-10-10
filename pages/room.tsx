import { faSquare, faThLarge, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Room, RoomEvent, setLogLevel, VideoPresets } from 'livekit-client';
import { DisplayContext, DisplayOptions, LiveKitRoom } from '@livekit/react-components';
import { useState } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
// import { useNavigate, useLocation } from 'react-router-dom';
import Router from 'next/router';
import { NextPage } from 'next';

const RoomPage: NextPage = () => {
  const [numParticipants, setNumParticipants] = useState(0);
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    stageLayout: 'grid',
    showStats: false,
  });
  const query = new URLSearchParams('http://localhost:3000/room/room?url=wss%3A%2F%2Flivekit.krejci.email&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkyNjQyMzksImlzcyI6IkFQSXlCdG9lcE5hdHNqeSIsImp0aSI6InRvbnlfc3RhcmsiLCJuYW1lIjoiVG9ueSBTdGFyayIsIm5iZiI6MTY2MzI2NDIzOSwic3ViIjoidG9ueV9zdGFyayIsInZpZGVvIjp7InJvb20iOiJzdGFyay10b3dlciIsInJvb21Kb2luIjp0cnVlfX0.5tqBfRrUHHsdMkA5kFGQMYRAzeNkvz3f7t7oOBsdP0c&videoEnabled=1&audioEnabled=1&simulcast=1&dynacast=1&adaptiveStream=1&videoDeviceId=240092b45667532940b32497114f7a559a9652f96cdff794c3049ac286ae8e41');
  // const url = query.get('url');
  // const token = query.get('token');

  const url = 'wss://livekit.krejci.email';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkyNjQyMzksImlzcyI6IkFQSXlCdG9lcE5hdHNqeSIsImp0aSI6InRvbnlfc3RhcmsiLCJuYW1lIjoiVG9ueSBTdGFyayIsIm5iZiI6MTY2MzI2NDIzOSwic3ViIjoidG9ueV9zdGFyayIsInZpZGVvIjp7InJvb20iOiJzdGFyay10b3dlciIsInJvb21Kb2luIjp0cnVlfX0.5tqBfRrUHHsdMkA5kFGQMYRAzeNkvz3f7t7oOBsdP0c';
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
          <h2>LiveKit Video</h2>
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