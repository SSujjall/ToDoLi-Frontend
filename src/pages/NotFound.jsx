import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

const NotFound = () => {
    const navigate = useNavigate();

    const goToHome = () => {
      navigate("/");
    }
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-8xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <Button className={"max-w-40"} onClick={goToHome} text="Go Home"></Button>
    </div>
  );
};

export default NotFound;
