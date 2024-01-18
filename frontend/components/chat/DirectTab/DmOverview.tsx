import React, { useState } from 'react'
import { ChatProps } from '@types'
import { doDelete, post, put } from '@utils/request/request';
import StandardButton from '@components/common/Buttons';
import SimpleForm from '@components/common/Forms';
import { validateChatroom } from '@app/chat/utils';
import InputSimple from '@components/common/Input';
import { validateChatroomPassword } from '@app/chat/serverUtils';

export default function DmOverview( { setCurrentRoom, key, room, myIntraId, userName, chatSocket } 
: ChatProps )
: React.JSX.Element
{
	const IntraIdNum = Number(myIntraId);

  return (
	<div className='p-5 border rounded-lg cursor-pointer' key={key}>
	  <p className='mb-2'>{room.name}</p>


		<div className="flex flex-col">
				<StandardButton
					onClick={() => put(`/chat/connect_to_chatroom/${room.name}`).then(() => setCurrentRoom(room.name))}
					text={"Join"}
					buttonStyle={"border-white border-[1px] hover:bg-violet-700/40 m-0 mr-4 mt-4"}
				/>
		</div>
	</div>
  )
}
