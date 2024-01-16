/* Import Components */
import SimpleForm from '@components/common/Forms'
import InputSimple from '@components/common/Input'
import StandardButton from '@components/common/Buttons'

/* Import functions */
import { changeUserName } from '../../../app/chat/utils'

/* Import React or Library functions */
import React from 'react'
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

  	return (
        <div>
			Hier moet een inputbox komen waar je een intraID invult. 
			Als je submit wordt een profiel getoond.
        </div>
  )
}

export default SettingsTab