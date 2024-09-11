import { Button } from "../components/Button";
import InputField from "../components/InputField";

const Login = () => {
  return (
    <div className="login-container">
      <h1 className="form-title">Login</h1>

      <form action="#" className="login-form">
        <InputField type="email" placeholder="Username" icon="mail" />

        <InputField type="password" placeholder="Password" icon="lock" />

        <a href="#" className="forgot-pass-link">
          Forgot Password?
        </a>

        <Button text="Login"></Button>
      </form>

      <p className="signup-text">
        Don&apos;t have an account yet? <a href="#">Signup Now</a>
      </p>
    </div>
  );
};

export default Login;
