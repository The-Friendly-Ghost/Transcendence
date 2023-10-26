/* Import Components */
import Dashboard from "@components/dashboard/dashboard";
import Login from "@components/login";

/* Import Global Variables */
import { isLoggedIn } from "@utils/isLoggedIn";

const Home = async () => {
  return (
    <div className="flex flex-wrap justify-center">
      {(await isLoggedIn()) ? <Dashboard /> : <Login />}
    </div>
  );
};

export default Home;
