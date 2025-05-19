import { Navigate } from "react-router-dom";
import { useAuthStore } from "../pages/store/useAuthstore";
import { Loader } from "lucide-react";

const PrivateRoute = ({ children }) => {
  const { authUser, ischeckingAuth } = useAuthStore();

  if (ischeckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return authUser ? children : <Navigate to="/login" replace />;
};
  

export default PrivateRoute;
