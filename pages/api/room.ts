// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { AccessToken } from 'livekit-server-sdk';
import crypto from 'crypto'
import randomstring from 'randomstring'



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userName } = req.body


    const id = randomstring.generate({
        length: 9,
        charset: 'abcdefghijklmnopqrstuvwxyz'
      }).match(/.{1,3}/g)

    const roomName = `${id[0]}-${id[1]}-${id[2]}`;


    const at = new AccessToken(process.env.LK_API_KEY, process.env.LK_API_SECRET, {identity: userName});

    at.addGrant({ roomJoin: true, room: roomName });
    const token = at.toJwt();


    if(token)
        res.status(200).json({roomId: roomName, token: token})

  }