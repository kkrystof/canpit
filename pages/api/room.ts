import type { NextApiRequest, NextApiResponse } from 'next'
import { AccessToken} from 'livekit-server-sdk';
import crypto from 'crypto'
import randomstring from 'randomstring'


import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'


// pages/api/user
export async function getData(userName: string, roomId: string) {
  const response = await fetch('/api/room',{ body: JSON.stringify({userName: userName, roomId: roomId})})
  const jsonData = await response.json()
  return jsonData
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const supabaseServerClient = createServerSupabaseClient({req, res})

  const { userName, roomId } = req.body

  let { data, error, status } = await supabaseServerClient
  .from('rooms')
  .select(`room_id`)
  .eq('room_id', roomId)
  .single()  


  if(!userName)
    res.status(400).json({error: 'not userName'})
  
    
  if(roomId && !data)
    res.status(400).json({error: 'did not find this room'})
    
    let roomName

    // should add user control
    if(roomId && data){
      roomName = roomId    
    }else{
      roomName = genRoomId()
      let { error } = await supabaseServerClient.from('rooms').upsert({room_id: roomName})
      console.log('insert ->', error);
    }
    

    const at = new AccessToken(process.env.LK_API_KEY, process.env.LK_API_SECRET, {identity: userName});
    at.addGrant({ roomJoin: true, room: roomName });
    const token = at.toJwt();

    // if(token)
    res.status(200).json({roomId: roomName, token: token})
    
  }

// room id generation
  const genRoomId = () => {
    
    const id: any = randomstring.generate({
      length: 9,
      charset: 'abcdefghijklmnopqrstuvwxyz'
    }).match(/.{1,3}/g)

    return `${id[0]}-${id[1]}-${id[2]}`
  }