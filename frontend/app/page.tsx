
/* Import Components */
import Dashboard from '@components/dashboard/dashboard';
import LoginScreen from '@components/login';

/* Import Global Variables */
import { userLoggedIn } from '@app/g_vars';

const Home = () => {
  return (
	<div className='flex flex-wrap justify-center'>
		{ userLoggedIn? <Dashboard /> : <LoginScreen /> }

	</div>

  )
}

export default Home