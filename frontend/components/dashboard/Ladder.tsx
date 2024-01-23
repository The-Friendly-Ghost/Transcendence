
import { getAllUsers, getUserInfo } from '@app/ServerUtils';
import React, { useEffect, useState } from 'react'

export default function Ladder()
{
	const [allUsers, setAllUsers] = useState<any>([]);

	// This useEffect is used to get the chat rooms from the backend
	  useEffect(() => {
		getAllUsers().then((users) => {
		  setAllUsers(users);
		});
	  }, []);

	return (
		<React.Fragment>
			<h2 className='dashboard-block-title'>
				Ladder
			</h2>
		<div className='dashboard-block-content content-center overflow-y-auto'>
			{allUsers.sort((a: any, b: any) => b.wins - a.wins).map((user: any, index: any) => (
			<div key={index}>
				<p>{user.name}: {user.wins} wins</p>
			</div>
    		))}
		</div>
			
		</React.Fragment>
	)
}
