import { useAuth } from "../components/AuthContext";

const Home = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Welcome Home!</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default Home;
