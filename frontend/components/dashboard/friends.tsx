import React from 'react'

/* Import Styles */
import '@styles/containers.css';
import '@styles/fonts.css';
import '@styles/buttons.css';


const friends = () => {
  return (
    <div>
      <h2 className='h2_font'>
        Friends
      </h2>

      <table className='w-full mt-4'>
        <thead>
          <tr>
            <th className='w-1/3 text-left'>Name</th>
            <th className='w-1/3 text-left'>Status</th>
            <th className='w-1/3 text-left'>Action</th>
          </tr>
        </thead>

      <tbody>

        <tr>
          <td>cpost</td>
          <td>Active</td>
          <td>
            <button 
              type="button"
              className="invite_btn">
              Invite
            </button>
          </td>
        </tr>

        <tr>
          <td>dritsema</td>
          <td>Offline</td>
          <td>
            <button 
              type="button"
              className="invite_btn">
              Invite
            </button>
          </td>
        </tr>

      </tbody>

      </table>

    </div>
  )
}

export default friends