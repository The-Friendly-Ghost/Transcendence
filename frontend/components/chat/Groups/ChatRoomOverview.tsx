import React, { useState } from 'react'
import { ChatProps } from '@types'
import { put } from '@utils/request/request';
import StandardButton from '@components/common/Buttons';
import SimpleForm from '@components/common/Forms';
import { validateChatroom } from '@app/chat/utils';
import InputSimple from '@components/common/Input';
import { validateChatroomPassword } from '@app/chat/serverUtils';

export default function ChatRoomOverview( { setCurrentRoom, key, room, myIntraId, userName, chatSocket } 
: ChatProps )
: React.JSX.Element
{
	const IntraIdNum = Number(myIntraId);
	const [password, setPassword] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");

  return (
	<div className='p-5 border rounded-lg cursor-pointer' key={key}>
	  <p className='mb-2'>{room.name}</p>

		{/* Check if room is public or private and show this in the information */}
	  {room.private === true ? 
	  	(<span className='mt-2 mr-3'><span className="inline-block h-2 w-2 rounded-full bg-orange-500 mr-2"></span>Private</span>)
		:(<span className='mt-2 mr-3'><span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2"></span>Public</span>)}
	
		{/* Check if a room is password protected. If so, create password box */}
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

				<div className='mt-3'>
					<SimpleForm
                        onSubmit= { async (event: any) => { 
							event.preventDefault();
							const valid = await validateChatroomPassword(room, password);
							if ( valid.body === true )
                            {
								setPassword("");
								put(`/chat/connect_to_chatroom/${room.name}`).then(() => setCurrentRoom(room.name))
                            }
							else
							{
								setPasswordError("Invalid password");
								setPassword("");
							}
                        }}
                        content = {
                            <div className="flex">
                                <InputSimple 
                                    input={password} 
                                    setInput={setPassword}
                                    placeholder={"Enter password"}
									type={"password"}
                                />
                                <StandardButton 
                                    text={"Join"}
                                    buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
                                />
                            </div>
                        }
                    />
				</div>
				{ passwordError !== "" && (
					<p className="text-red-500">{passwordError}</p>
				)}
			</React.Fragment>
		)}

	{/* Check if user is the owner of the room. If so, show admin panel */}
	{room.ownerIntraId === Number(myIntraId) ? 
		<details>
			<summary className="h4_font font-bold pt-4 w-full cursor-pointer">
				Admin Panel
			</summary>
			<div className="flex flex-col">
				<StandardButton
					onClick={() => put(`/chat/delete_chatroom/${room.name}`).then(() => setCurrentRoom(room.name))}
					text={"Delete Chatroom"}
					buttonStyle={"border-white border-[1px] hover:bg-red-700/40 hover:shadow-red-500 m-0 mr-4 mt-4"}
				/>
			</div>
		</details>
		: 
		<></>
	}


	</div>
  )
}
