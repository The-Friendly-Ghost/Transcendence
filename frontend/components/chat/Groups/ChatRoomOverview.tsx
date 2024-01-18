import React, { useState } from 'react'
import { ChatProps } from '@types'
import { doDelete, post, put } from '@utils/request/request';
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
	const [addUser, setAddUser] = useState<string>("");
	const [removeUser, setRemoveUser] = useState<string>("");
	const [makeAdmin, setMakeAdmin] = useState<string>("");
	const [newRoomPassword, setNewRoomPassword] = useState<string>("");
	const [banUser, setBanUser] = useState<string>("");

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

				{/* Delete chatroom */}
				<p className='my-3'>Delete chatroom</p>
				<StandardButton
					onClick={ async () => {
						await doDelete(`/chat/delete_chatroom/${room.name}`)
						window.location.reload();
					}}
					text={"Delete Chatroom"}
					buttonStyle={"border-white border-[1px] hover:bg-red-700/40 hover:shadow-red-500 m-0 mr-4 w-[200px]"}
				/>

				{/* Add user to chatroom */}
				<p className='my-3'>Add User</p>
				<SimpleForm
                    onSubmit= { async (event: any) => { 
						await put(`/chat/add_user_to_chatroom/${room.name}/${addUser}`)
                    }}
                    content = {
                        <div className="flex">
                            <InputSimple 
                                input={addUser} 
                                setInput={setAddUser}
                                placeholder={"IntraID"}
                            />
                            <StandardButton 
                                text={"Add"}
                                buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
                            />
                        </div>
                    }
                />

				{/* Ban user */}
				<p className='my-3'>Ban user</p>
				<SimpleForm
                    onSubmit= { async (event: any) => { 
						await put(`/chat/ban_user/${room.name}/${banUser}`)
                    }}
                    content = {
                        <div className="flex">
                            <InputSimple 
                                input={banUser}
                                setInput={setBanUser}
                                placeholder={"intraID"}
                            />
                            <StandardButton 
                                text={"Ban"}
                                buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
                            />
                        </div>
                    }
                />

				{/* Remove user from chatroom*/}
				<p className='my-3'>Remove User</p>
				<SimpleForm
                    onSubmit= { async (event: any) => { 
						await put(`/chat/remove_user_from_chatroom/${room.name}/${removeUser}`)
                    }}
                    content = {
                        <div className="flex">
                            <InputSimple 
                                input={removeUser} 
                                setInput={setRemoveUser}
                                placeholder={"IntraID"}
                            />
                            <StandardButton 
                                text={"Remove"}
                                buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
                            />
                        </div>
                    }
                />

				{/* Toggle public/private */}
				<p className='my-3'>Toggle public/private</p>
				<StandardButton
					onClick={async () => {
						await put(`/chat/toggle_access/${room.name}`)
						window.location.reload();
					}}
					text={"Set " + (room.private === true ? "public" : "private")}
					buttonStyle={"border-white border-[1px] hover:bg-red-700/40 hover:shadow-red-500 m-0 mr-4 w-[200px]"}
				/>

				{/* Leave chatroom [in Chatroom]*/}

				{/* Make Admin */}
				<p className='my-3'>Make admin</p>
				<SimpleForm
                    onSubmit= { async (event: any) => { 
						await put(`/chat/make_admin/${room.name}/${makeAdmin}`)
                    }}
                    content = {
                        <div className="flex">
                            <InputSimple 
                                input={makeAdmin} 
                                setInput={setMakeAdmin}
                                placeholder={"IntraID"}
                            />
                            <StandardButton 
                                text={"Set"}
                                buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
                            />
                        </div>
                    }
                />

				{/* Change chatroom password */}
				<p className='my-3'>New password</p>
				<SimpleForm
                    onSubmit= { async (event: any) => { 
						await put(`/chat/set_password/${room.name}/${newRoomPassword}`)
                    }}
                    content = {
                        <div className="flex">
                            <InputSimple 
                                input={newRoomPassword}
                                setInput={setNewRoomPassword}
                                placeholder={"new password"}
                            />
                            <StandardButton 
                                text={"Set"}
                                buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
                            />
                        </div>
                    }
                />

				{/* Reset Password*/}
				<p className='my-3'>Reset password</p>
				<StandardButton
					onClick={async () => {
						await put(`/chat/reset_password/${room.name}`)
						window.location.reload();
					}}
					text={"Reset password"}
					buttonStyle={"border-white border-[1px] hover:bg-red-700/40 hover:shadow-red-500 m-0 mr-4 w-[200px]"}
				/>

				{/* Join Chatroom [niet vereist] */}

				{/* Change owner [niet vereist]*/}

			</div>
		</details>
		: 
		<></>
	}


	</div>
  )
}
