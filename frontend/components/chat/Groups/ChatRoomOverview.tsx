import React from 'react'
import { ChatProps } from '@types'
import { put } from '@utils/request/request';

export default function ChatRoomOverview( { setCurrentRoom, key, room, myIntraId, userName, chatSocket } 
: ChatProps )
: React.JSX.Element
{
	const IntraIdNum = Number(myIntraId);

  return (
	<div className='p-5 border rounded-lg hover:bg-violet-700/40 cursor-pointer' key={key} onClick={() => put(`/chat/connect_to_chatroom/${room.name}`).then(() => setCurrentRoom(room.name))}>
	  {room.name}

	  {room.private === true ? 
	  	(<p><span className="inline-block h-2 w-2 rounded-full bg-orange-500 mr-2"></span>private</p>)
		:(<p><span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>public</p>)}
		

	</div>
  )
}

/*
	StandardButton
        onClick={ () => { setCurrentRoom(room.name) } }
        key={index}
        text={room.name}
        buttonStyle={"border-white border-[1px] hover:bg-violet-700/40 m-0 mr-4 mb-4"}
    />
*/
