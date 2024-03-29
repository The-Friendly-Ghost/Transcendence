import { changeUsername, uploadAvatar } from '@app/ServerUtils';
import { changeUserName } from '@app/chat/utils';
import StandardButton from '@components/common/Buttons';
import SimpleForm from '@components/common/Forms'
import InputSimple from '@components/common/Input'
import { postImage } from '@utils/request/request';
import React, { useState } from 'react'

export default function Settings()
{
	const [newUserName, setNewUserName] = useState<string>("");
	const [errorUserName, setErrorUserName] = useState<string>("");

	function validateNewUsername(): boolean
	{
		if (newUserName.length < 3 || newUserName.length > 14)
		{
			setErrorUserName("Username must be between 3 and 14 characters");
			setNewUserName("");
			return (false);
		}
		return (true);
	}

	return (
		<React.Fragment>
			<h2 className='dashboard-block-title'>
				Settings
			</h2>

			<div className='dashboard-block-content content-center overflow-y-auto'>
				<p className='pb-3 font-bold'>Change username</p>
				<SimpleForm
					onSubmit= { (event: any) => {
						if (validateNewUsername() === true) {
							changeUsername(newUserName)}
						else
							event.preventDefault();
						}
					}
					content = 
					{
						<div className="flex">
							<InputSimple 
							input={newUserName} 
							setInput={setNewUserName}
							placeholder={"New username"}
							/>
							<StandardButton 
							text={"Change"}
							buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
							/>
						</div>
					}
				/>
				<p className='text-red-600'>{errorUserName}</p>

				<p className='pb-3 font-bold'>Change profile picture</p>
					<form onSubmit={(event) => {
						event.preventDefault();
						const fileInput = (event.target as HTMLFormElement).elements.namedItem('newAvatar') as HTMLInputElement;
						if (fileInput.files && fileInput.files.length > 0) {
							const file = fileInput.files[0];
							const formData = new FormData();
							formData.append('newAvatar', file);
							uploadAvatar(formData);
							// console.log("avatar uploaded")
							console.log(formData)
							// window.location.reload();
						}
					}}>
						<input type='file' id='newAvatar' name='newAvatar' accept='*/*' />
						<StandardButton 
							text={"Upload"}
							buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
						/>
					</form>
				
			</div>
		</React.Fragment>
	)
}
