import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import decode from "jwt-decode";

const Protected = ({ admin, children }) => {
  const {user} = useContext(AuthContext)
  const location = useLocation();

  const verifyLoggedInUser = () => {
    const userData = JSON.parse(localStorage.getItem("userData"))
    if (!userData) return false;

    const decodedToken = decode(userData.token);
    
    if (decodedToken.exp * 1000 < new Date().getTime()) {
      localStorage.clear();
      return false;
    }
    return true;
  }
  const loggedIn = verifyLoggedInUser()

  if (!user && !loggedIn) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }
  if (admin) {
    if (user?.role !== "admin") {
      return <Navigate to="/" replace state={{ path: location.pathname }} />;
    }
  }
  return children;
};

export default Protected;
