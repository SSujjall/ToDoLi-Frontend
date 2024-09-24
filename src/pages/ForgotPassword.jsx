import { Button } from "../components/Button";
import InputField from "../components/InputField";

const ForgotPassword = () => {
    return (
      <div className="login-container">
        <h1 className="text-3xl text-center mb-6 font-bold">Reset Password</h1>
  
        <form action="#" className="login-form">
          <InputField type="email" placeholder="Username" icon="mail" />
  
          <Button text="Proceed"></Button>
        </form>
      </div>
    );
  };
  
  export default ForgotPassword;