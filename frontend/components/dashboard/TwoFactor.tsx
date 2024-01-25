import StandardButton from '@components/common/Buttons';
import React, { useState } from 'react'
import { post } from '@utils/request/request';

export default function TwoFactor(props: any)
{

	return (
		<React.Fragment>
			<h2 className='dashboard-block-title'>
				2FA
			</h2>

			<div className='dashboard-block-content content-center overflow-y-auto'>
				<p>
					2FA Secret: {props.mySecret.secret}
				</p>
					<StandardButton
						onClick={ () => post('/auth/2fa/toggle/' + props.intraId) }
						text={props.twoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
						buttonStyle={"w-[200px] border-white border-[1px] hover:bg-violet-700/40 m-0 mr-4 mt-4"}
					/>
			</div>
		</React.Fragment>
	)
}
