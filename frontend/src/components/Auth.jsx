import { useEffect } from "react";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";

const Auth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const router = useNavigate();
    const { user } = useStore();
    useEffect(() => {
      if (!user) {
        router("/", { replace: true });
      }
    }, [user, router]);
    return user ? <WrappedComponent {...props} /> : null;
  };

  return AuthComponent;
};

export default Auth;
