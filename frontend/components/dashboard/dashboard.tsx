/* Import Components */
import UserInfo from '@components/dashboard/userInfo';
import Play from '@components/dashboard/play';
import Friends from '@components/dashboard/friends';
import { getCoockie } from '@app/actions'

/* Import Styles */
import '@styles/containers.css';
import '@styles/fonts.css';

async function dashboard() {

  /* Gets a Cookie with user information.
  This has to be changed so that the cookie contains
  all information, not just username */
  const intraName = await getCoockie('username');

  return (
	<div className='dashboard_grid'>
    <div className='dashboard_block'>
      <UserInfo
        info = {intraName}
      /> 
    </div>
    <div className='dashboard_block'>
      <Play />
    </div>
    <div className='dashboard_block'>
      <Friends />
    </div>
    <div className='dashboard_block'>
      <p>STATS</p>
    </div>
    <div className='dashboard_block'>
      <p>LEADERBOARD</p>
    </div>
    <div className='dashboard_block'>
      <p>2FA</p>
    </div>
  </div>
  )
}

export default dashboard