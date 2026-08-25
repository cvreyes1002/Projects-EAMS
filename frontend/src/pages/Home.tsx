import { useAuth } from '../components/AuthContext';

export default function HomePage() {
  const { logout } = useAuth();

  return (
    <div>
      <h1>Welcome Home!</h1>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}