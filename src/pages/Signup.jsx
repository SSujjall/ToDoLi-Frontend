import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { registerUser } from "../services/Api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await registerUser(
        username,
        firstname,
        lastname,
        email,
        password
      );
      setSuccess(data); // Show success message
      // Redirect to login after successful registration
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="form-title">Signup</h1>

      <form onSubmit={handleRegister} className="login-form">
        <InputField
          type="text"
          placeholder="Username"
          icon="person"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
          type="text"
          placeholder="First Name"
          icon="id_card"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <InputField
          type="text"
          placeholder="Last Name"
          icon="id_card"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <InputField
          type="email"
          placeholder="Email"
          icon="mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Password"
          icon="lock"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <Button text="Signup"></Button>
      </form>

      <p className="signup-text">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
