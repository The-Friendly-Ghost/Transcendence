/* import Components */
import React from 'react'
import Image from 'next/image'

function userInfo(props: any) 
{
  return (
    <div>
      <h2 className='dashboard-block-title'>
        User Info {props.info}
      </h2>
      <div className='dashboard-block-content grid grid-cols-3'>
        <div className='col-span-1'>
          Avatar Hier
        </div>
        <div className='col-span-2 grid grid-cols-1'>
          <div>Naam</div>
          <div>info 2</div>
          <div>info 3</div>
        </div>
      </div>
    </div>
  )
}

export default userInfo