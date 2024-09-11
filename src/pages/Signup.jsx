import { Button } from "../components/Button";
import InputField from "../components/InputField";

const Signup = () => {
  return (
    <div className="login-container">
      <h1 className="form-title">Signup</h1>

      <form action="#" className="login-form">
        <InputField type="text" placeholder="Username" icon="person" />
        <InputField type="text" placeholder="First Name" icon="id_card" />
        <InputField type="text" placeholder="Last Name" icon="id_card" />
        <InputField type="email" placeholder="Email" icon="mail" />
        <InputField type="password" placeholder="Password" icon="lock" />

        <Button text="Login"></Button>
      </form>

      <p className="signup-text">
        Already have an account? <a href="#">Login</a>
      </p>
    </div>
  );
};

export default Signup;
