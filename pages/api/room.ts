// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto'
import randomstring from 'randomstring'

import Database from 'better-sqlite3';
const db = new Database('./pages/api/db/rooms.db');



// pages/api/user
export async function getData(userName: string, roomId: string) {
  const response = await fetch('/api/room',{ body: JSON.stringify({userName: userName, roomId: roomId})})
  const jsonData = await response.json()
  return jsonData
}



export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const roomExist = db.prepare('select 1 from rooms where roomId = ?');
  const addRoom = db.prepare('insert into rooms (roomId, createdBy) VALUES (?, ?)');

  const { userName, roomId } = req.body

  // let roomName

  if(!userName)
    res.status(400).json({error: 'not userName'})
    
  if(roomId && !roomExist.get(roomId))
    res.status(400).json({error: 'did not find this room'})
    
    

    const roomName = (roomExist.get(roomId)) ? roomId : genRoomId()
    addRoom.run(roomName, userName)




    // const at = new AccessToken(process.env.LK_API_KEY, process.env.LK_API_SECRET, {identity: userName});

    // at.addGrant({ roomJoin: true, room: roomName });
    // const token = at.toJwt();



    const token = 'test-TOKEN'


    // if(token)
        res.status(200).json({roomId: roomName, token: token})

  }

// room id generation
  const genRoomId = () => {
    
    const id = randomstring.generate({
      length: 9,
      charset: 'abcdefghijklmnopqrstuvwxyz'
    }).match(/.{1,3}/g)

    return `${id[0]}-${id[1]}-${id[2]}`
  }