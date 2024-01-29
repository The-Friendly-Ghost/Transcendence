import React, { use, useEffect, useState } from 'react'
import { ChatProps } from '@types'
import { doDelete, get, post, put } from '@utils/request/request';
import StandardButton from '@components/common/Buttons';
import SimpleForm from '@components/common/Forms';
import { validateChatroom } from '@app/chat/utils';
import InputSimple from '@components/common/Input';
import { validateChatroomPassword } from '@app/chat/serverUtils';
import { getOtherUser } from '@app/ServerUtils';

export default function DmOverview( { setCurrentRoom, key, room, myIntraId, userName, chatSocket } 
: ChatProps )
: React.JSX.Element
{
	const IntraIdNum = Number(myIntraId);
	const [otherIntraId, setOtherIntraId] = useState<any>();

	useEffect(()  => {
		const fetchFriendId = async () => {
			const temp = await getOtherUser(room.name);
			if (temp) {
				if (temp.ownerIntraId !== IntraIdNum) {
					setOtherIntraId(temp.ownerIntraId);
				} else {
					setOtherIntraId(temp.users[0].intraId);
				}
			}
		};
		fetchFriendId();
	}, []);

  return (
	<div className='p-5 border rounded-lg cursor-pointer' key={key}>
	  <p className='mb-2'>{room.name}</p>


		<div className="flex flex-col">
				<StandardButton
					onClick={() => put(`/chat/connect_to_chatroom/${room.name}`).then(() => setCurrentRoom(room.name))}
					text={"Join"}
					buttonStyle={"border-white border-[1px] hover:bg-violet-700/40 m-0 mr-4 mt-4"}
				/>
				<StandardButton
					onClick={() => get(`/game/invitePlayer/${otherIntraId}`)}
					text={"Invite " + otherIntraId}
					buttonStyle={"w-[200px] border-white border-[1px] hover:bg-violet-700/40 m-0 mr-4 mt-4"}
				/>
		</div>
	</div>
  )
}
