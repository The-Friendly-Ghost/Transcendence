import SimpleForm from '@components/Forms';
import StandardButton from '@components/buttons';
import InputSimple from '@components/input';
import React, { useState } from 'react'
import { Socket } from 'socket.io-client'

export function GroupsTab({ chatSocket, userName, intraId }
	: {  chatSocket: Socket | null, userName: string, intraId: string})
	: React.JSX.Element
{
    const [currentRoom, setCurrentRoom] = useState<string>("");

    return (
        <div>
            <h2 className="h4_font font-bold pb-4">Join chat room</h2>
            <h2 className="h4_font font-bold pb-4">Create new room</h2>
                <SimpleForm
                    // onSubmit={}
                    content = {
                        <div className="flex">
                            <InputSimple 
                            />
                            <StandardButton 
                                text={"Create"}
                                buttonStyle={"border-white border-[1px] hover:bg-white/20"}
                            />
                        </div>
                    }
                />
        </div>
    );
    }

export default GroupsTab