/* Import Components */
import UserInfo from '@components/dashboard/userInfo';
import Play from '@components/dashboard/play';
import Friends from '@components/dashboard/friends';

/* Import Styles */
import '@styles/containers.css';
import '@styles/fonts.css';


const dashboard = () => {
  return (
	<div className='dashboard_grid'>
    <div className='dashboard_block'>
      <UserInfo /> 
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