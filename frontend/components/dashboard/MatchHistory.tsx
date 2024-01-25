import { getAllUsers, getMatchHistory, getUserInfo } from '@app/ServerUtils';
import React, { useEffect, useState } from 'react'

export default function MatchHistory()
{
	const [MatchHistory, setMatchHistory] = useState<any>([]);

	// This useEffect is used to get the chat rooms from the backend
	  useEffect(() => {
		getMatchHistory().then((allMatches) => {
			if (Array.isArray(allMatches)) {
				setMatchHistory(allMatches);
			} else {
				console.error('Expected allMatches to be an array, got', allMatches);
			}
		});
	  }, []);

	return (
		<React.Fragment>
			<h2 className='dashboard-block-title'>
				My History
			</h2>
		<div className='dashboard-block-content content-center overflow-y-auto'>
			{MatchHistory.map((match: any, index: any) => (
			<div key={index}>
				<p>{match.p1} || <b>{match.score[0]} - {match.score[1]} </b>|| {match.p2}</p>
			</div>
			))}
		</div>
			
		</React.Fragment>
	)
}
