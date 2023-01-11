

const actQuene = async (data: Transport, participantId?: string) => {
    // befoe sent -> added type of event
    const payload = encoder.encode(JSON.stringify({ type: 'actQuene', ...data }))
    await room.localParticipant.publishData(payload, DataPacket_Kind.RELIABLE)
  }

  //event handler of actQuene
  const actQueneHandler = ({cmd, props}) => {

    const cmds = {
      'start' : () => actQueneStart(props),
      'end' : () => {}, // more correct LEAVE
      'add' : () => {},
      'remove' : () => {}
    }
    
    return cmds[cmd]()
  }

  
  const actQueneStart= ({props}) => {
    // menu off
    click()
    act()
    setActivity(list[props.id])    
    console.log('activity started', props)
    console.log(participants.map(p => p.sid));
  } 

  const actQueneAdd = ({props}) => {
    console.log('qAdd');
    
  }
  
  const actQueneRemove = ({}) => {
    console.log('qRemove');
    
  }