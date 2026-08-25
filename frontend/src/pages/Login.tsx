import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import api from "../api";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useAuth } from "../components/AuthContext";

const Login = () => {
  const { login, register } = useAuth();
  const [state, setState] = useState("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (state === "register") {
      try {
        await register(formData.first_name, formData.last_name, formData.email, formData.password);
        onClose();
      } catch(err: any) {
          const message = err.message || "Registration failed";
          setErrorMessage(message); // Captures the error thrown by AuthProvider
          console.log(message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await login(formData.email, formData.password);
        navigate("/")
      } catch (err: any) {
        const message = err.message || "Login failed";
        setErrorMessage(message); // Captures the error thrown by AuthProvider
        console.log(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-88 text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>
        {state === "register" && (
          <>
            <div className="w-full">
              <p>First Name</p>
              <input
                type="text"
                name="first_name"
                placeholder="John"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full">
              <p>Last Name</p>
              <input
                type="text"
                name="first_name"
                placeholder="John"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <div className="w-full ">
          <p>Email</p>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            type="password"
            name="password"
            placeholder="password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            onChange={handleChange}
            required
          />
        </div>
        {state === "register" && (
            <div className="w-full">
              <p>Confirm Password</p>
              <input
                type="text"
                name="confirm_password"
                placeholder="Confirm password"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                onChange={handleChange}
                required
              />
            </div>
        )}
        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-indigo-500 cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-indigo-500 cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
        <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
