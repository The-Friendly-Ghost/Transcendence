/* import Components */
import React from 'react'
import Image from 'next/image'
import { getCoockie } from '@app/actions'

const userInfo = async () => {
  const name = await getCoockie('username');
  return (
    <div>
      <h2 className='h2_font'>
        User Info {name}
      </h2>
      <div className='grid grid-cols-3 mt-4'>
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