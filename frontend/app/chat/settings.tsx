import Accordion from '@components/Accordion'
import SimpleForm from '@components/Forms'
import React from 'react'
import { changeUserName } from './actions'
import InputSimple from '@components/input'
import StandardButton from '@components/buttons'
import { Socket } from 'socket.io-client'
import { useState } from 'react'

/**
 * 
 * @param setUserName The function to set the user name
 * @param chatSocket The socket to send and receive messages
 * @param userName The user name of the user
 * @param intraId The 42 intraId of the user.
 * @returns A JSX Element that represents the settings tab.
 */
export function SettingsTab({ setUserName, chatSocket, userName, intraId}
	: {  setUserName: React.Dispatch<React.SetStateAction<string>>, chatSocket: Socket | null, 
		userName: string, intraId: string})
	: React.JSX.Element
{

	// The New user name of the user
	const [newUserName, setNewUserName] = useState<string>("");

  	return (
        <div>
			<h2 className="h4_font font-bold pb-4">Change username</h2>

        	<SimpleForm
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => changeUserName(event, newUserName, setUserName, chatSocket, userName, intraId, setNewUserName)}
                content={
                  <div className="flex">
                    <InputSimple 
                      input={newUserName} 
                      setInput={setNewUserName}
                      placeholder={"Type new username here ..."}
                    />
                    <StandardButton 
						text={"Change"}
						buttonStyle={"border-white border-[1px] hover:bg-white/20"}
					/>
                  </div>
                }
            />

			<p className='py-3 border-b-[1px]'>
				<span className="font-bold">Current username: </span>
				{userName}
			</p>
        </div>
  )
}

export default SettingsTab