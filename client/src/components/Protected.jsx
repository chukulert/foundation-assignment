import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Protected = ({ admin, children }) => {
  const {user} = useContext(AuthContext)
  const location = useLocation();

  if (!user) {
    console.log('no user')
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }
  if (admin) {
    if (user.role !== "admin") {
        console.log('not admin')
      return <Navigate to="/" replace state={{ path: location.pathname }} />;
    }
  }
  return children;
};

export default Protected;
