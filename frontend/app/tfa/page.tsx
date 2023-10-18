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
	<section className='container_full_centered'>

		<form onSubmit={handleSubmit}>
			<input 
				type="text" 
				// value={inputValue} 
				// onChange={handleChange} 
				className="p-2 w-full rounded-md text-black"
				placeholder="2FA code"
			/>
			<button 
				type="submit" 
				className="main_btn">
					Verify
			</button>
		</form>

	</section>
  )
}

export default tfa_page