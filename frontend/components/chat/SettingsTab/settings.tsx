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
import { getUserInfo } from '@app/ServerUtils'
import { createChatRoom } from '@app/chat/serverUtils'
import { put } from '@utils/request/request'
import Image from 'next/image'

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

	// Find user input
	const [toFind, setToFind] = useState<string>("");
    // Find user error
    const [errorMessage, setErrorMessage] = useState<string>("");

	// Username info
	const [showUserName, setShowUserName] = useState<string>("");
	const [showImageUrl, setShowImageUrl] = useState<string>("");
	const [showWins, setShowWins] = useState<string>("");
	const [showLosses, setShowLosses] = useState<string>("");

  	return (
        <div>
			<p className='mb-3'>Find user profile</p>
                    <SimpleForm
                        onSubmit= { async (event: any) => {
                            event.preventDefault();
                            let numUser = Number(toFind);
                            const dmUser: any = await getUserInfo(numUser);

                            if (dmUser.message && dmUser.message === "Not Found")
                                setErrorMessage("User not found");
                            else
                            {
                                setShowUserName(dmUser.name);
								setShowImageUrl(dmUser.image_url);
								setShowWins(dmUser.wins);
								setShowLosses(dmUser.losses);
                            }
                        }}
                        content = {
                            <div className="flex">
                                <InputSimple
                                    input={toFind}
                                    setInput={setToFind}
                                    placeholder={"IntraID"}
                                />
                                <StandardButton
                                    text={"Search"}
                                    buttonStyle={"border-white border-[1px] hover:bg-violet-700/40"}
                                />
                            </div>
                        }
                    />

				<p>Name: {showUserName}</p>
				{/* <image src={showImageUrl} /> */}
                {showImageUrl != "" && (
                    <Image
                      src={showImageUrl}
                      alt="User Avatar"
                      width={120}
                      height={120}
                      className='rounded-lg height-auto width-auto'
                    />
                )}
				<p>Wins: {showWins}</p>
				<p>Losses: {showLosses}</p>
        </div>
  )
}

export default SettingsTab
