import React, { use, useEffect, useState } from 'react'
import { ChatProps } from '@types'
import { doDelete, get, post, put } from '@utils/request/request';
import StandardButton from '@components/common/Buttons';
import SimpleForm from '@components/common/Forms';
import { validateChatroom } from '@app/chat/utils';
import InputSimple from '@components/common/Input';
import { validateChatroomPassword } from '@app/chat/serverUtils';
import { getOtherUser } from '@app/ServerUtils';
import { useRouter } from 'next/navigation'
import { invitePlayer } from './invitePlayer';

export default function DmOverview( { setCurrentRoom, room, myIntraId, userName, chatSocket }
: ChatProps )
: React.JSX.Element
{
	const IntraIdNum = Number(myIntraId);
	const [otherIntraId, setOtherIntraId] = useState<any>();
	const [otherName, setOtherName] = useState<any>();
	const router = useRouter();

	useEffect(()  => {
		const fetchFriendId = async () => {
			const temp = await getOtherUser(room.name);
			if (temp && temp.users[0] && temp.users[1]) {
				if (temp.users[0].intraId !== IntraIdNum) {
					setOtherIntraId(temp.users[0].intraId);
					setOtherName(temp.users[0].name);
				} else {
					setOtherIntraId(temp.users[1].intraId);
					setOtherName(temp.users[1].name);
				}
			}
		};
		fetchFriendId();
	}, []);

  return (
	<div className='p-5 border rounded-lg cursor-pointer'>
	  <p className='mb-2'>{room.name}</p>


		<div className="flex flex-col">
				<StandardButton
					onClick={() => put(`/chat/connect_to_chatroom/${room.name}`).then(() => setCurrentRoom(room.name))}
					text={"Join"}
					buttonStyle={"border-white border-[1px] hover:bg-violet-700/40 m-0 mr-4 mt-4"}
				/>
				<StandardButton
					onClick={() => invitePlayer(otherIntraId)
						.then(response => {
							if (response && response.success) {
								router.push("/play")
							}
						})
					}
					text={"Invite " + otherName}
					buttonStyle={"w-[200px] border-white border-[1px] hover:bg-violet-700/40 m-0 mr-4 mt-4"}
				/>
		</div>
	</div>
  )
}
