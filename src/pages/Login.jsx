import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/Api";
import InputField from "../components/InputField";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await loginUser(username, password);
      localStorage.setItem("token", data.token);
      navigate("/index");
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="login-container">
      <h1 className="text-3xl text-center mb-6 font-bold">Login</h1>

      <form onSubmit={handleLogin} className="login-form">
        <InputField
          type="text"
          placeholder="Username"
          icon="mail"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <InputField
          type="password"
          placeholder="Password"
          icon="lock"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link to="/forgot-password" className="forgot-pass-link">
          Forgot Password?
        </Link>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <Button text="Login"></Button>
      </form>

      <p className="signup-text">
        Don&apos;t have an account yet? <Link to="/signup">Signup Now</Link>
      </p>
    </div>
  );
};

export default Login;
