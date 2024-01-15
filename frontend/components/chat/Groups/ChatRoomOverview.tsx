import React from 'react'
import { ChatProps } from '@types'
import { put } from '@utils/request/request';
import StandardButton from '@components/common/Buttons';

export default function ChatRoomOverview( { setCurrentRoom, key, room, myIntraId, userName, chatSocket } 
: ChatProps )
: React.JSX.Element
{
	const IntraIdNum = Number(myIntraId);

  return (
	<div className='p-5 border rounded-lg cursor-pointer' key={key}>
	  <p className='mb-2'>{room.name}</p>

	  {room.private === true ? 
	  	(<span className='mt-2 mr-3'><span className="inline-block h-2 w-2 rounded-full bg-orange-500 mr-2"></span>Private</span>)
		:(<span className='mt-2 mr-3'><span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>Public</span>)}
		
	  {room.pw_hash === null ? 
	  	(
			<React.Fragment>
				<span className='mt-2 mr-3'><span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>Open</span>
				<div>
					<StandardButton
						onClick={() => put(`/chat/connect_to_chatroom/${room.name}`).then(() => setCurrentRoom(room.name))}
						text={"Join"}
						buttonStyle={"border-white border-[1px] hover:bg-violet-700/40 m-0 mr-4 mt-4"}
					/>
				</div>
			</React.Fragment>
		)
		:(
			<React.Fragment>
				<span className='mt-2 mr-3'>
					<span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-2"></span>
						Password protected
				</span>
			</React.Fragment>
		)}

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
