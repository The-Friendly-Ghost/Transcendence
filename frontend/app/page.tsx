/* Import Components */
import Dashboard from "@components/dashboard/dashboard";
import LoginScreen from "@components/login";

/* Import Global Variables */
import { isLoggedIn } from "@utils/isLoggedIn";

const Home = async () => {
  return (
    <div className="flex flex-wrap justify-center">
      {(await isLoggedIn()) ? <Dashboard /> : <LoginScreen />}
    </div>
  );
};

export default Home;
