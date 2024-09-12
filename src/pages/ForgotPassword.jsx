import { Button } from "../components/Button";
import InputField from "../components/InputField";

const ForgotPassword = () => {
    return (
      <div className="login-container">
        <h1 className="form-title">Reset Password</h1>
  
        <form action="#" className="login-form">
          <InputField type="email" placeholder="Username" icon="mail" />
  
          <Button text="Proceed"></Button>
        </form>
      </div>
    );
  };
  
  export default ForgotPassword;