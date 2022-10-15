// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto'
import randomstring from 'randomstring'


// pages/api/user
export async function getData(userName: string, roomId: string) {
  const response = await fetch('/api/room',{ body: JSON.stringify({userName: userName, roomId: roomId})})
  const jsonData = await response.json()
  return jsonData
}



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userName, roomId } = req.body


    const roomName = (roomId) ? roomId : genRoomId()


    const at = new AccessToken(process.env.LK_API_KEY, process.env.LK_API_SECRET, {identity: userName});

    at.addGrant({ roomJoin: true, room: roomName });
    const token = at.toJwt();


    if(token)
        res.status(200).json({roomId: roomName, token: token})

  }

  const genRoomId = () => {

    const id = randomstring.generate({
      length: 9,
      charset: 'abcdefghijklmnopqrstuvwxyz'
    }).match(/.{1,3}/g)

    return `${id[0]}-${id[1]}-${id[2]}`;
  }