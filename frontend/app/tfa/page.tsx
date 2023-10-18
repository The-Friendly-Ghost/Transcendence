"use client"

/* Import Components */
import { useState } from 'react';

/* Import Global Variables */
import { userLoggedIn } from '@app/g_vars';

/* Import Styles */
import '@styles/containers.css';
import '@styles/fonts.css';
import '@styles/buttons.css';

const tfa_page = () => {

	const [inputValue, setInputValue] = useState('');
	  
	const handleSubmit = () => {
		// event.preventDefault();
		// // Voer hier de actie uit die je wilt doen met de ingevoerde waarde
		// console.log(inputValue);
	};
	  
	const handleChange = () => {
		// setInputValue(event.target.value);
	};

  return (
	<div className='container_full_centered'>
		<div className='w-[300px]'>
		<h1 className="h3_font mb-2">2FA required</h1>
		<form onSubmit={handleSubmit}>
			<input 
				type="text" 
				// value={inputValue}
				onChange={handleChange}
				className="p-2 w-full rounded-md text-black"
				placeholder="Enter code"
			/>
			<button 
				type="submit" 
				className="main_btn w-full">
					Verify
			</button>
		</form>
	</div>
	</div>
  )
}

export default tfa_page