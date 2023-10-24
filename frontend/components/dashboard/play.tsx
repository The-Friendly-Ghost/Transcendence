/* Import Components */
import React from 'react';
import CustomButton from '@components/utils/customButtom';

const play = () => {
  return (
    <div>
      <h2 className='h2_font'>
        Play
      </h2>
      <CustomButton 
          type = "button"
          title = "Play Now"
          styles = "main_btn"
          // handleClick = PLAY FUNCTIE HIER
        />
    </div>
  )
}

export default play