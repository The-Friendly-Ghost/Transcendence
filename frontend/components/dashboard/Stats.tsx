/* import Styles */
import '@styles/fonts.css';

/* import Components */
import React from 'react'

function Stats(props: any) 
{
	const losses = props.losses ? props.losses : 1;
	const wins = props.wins ? props.wins : 1;
	let ratio = wins / losses;
	
	return (
		<div className='flex flex-col h-full'>
			<h2 className='dashboard-block-title'>
				Stats
			</h2>

			<div className='flex-1 dashboard-block-content grid grid-cols-3 gap-4 content-center'>
				<div className='text-center'>
					<h3 className='h3_font pb-4'>Wins</h3>
					<p className='text-5xl text-green-700'>{props.wins ? props.wins : "0"}</p>
				</div>
				<div className='text-center'>
					<h3 className='h3_font pb-4'>Losses</h3>
					<p className='text-5xl text-red-700'>{props.losses ? props.losses : "0"}</p>
				</div>
				<div className='text-center'>
					<h3 className='h3_font pb-4'>W/L ratio</h3>
					<p className='text-5xl text-col2'>{ratio}</p>
				</div>
		</div>
		</div>
  )
}

export default Stats