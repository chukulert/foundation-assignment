import decode from "jwt-decode";
import { useEffect, useState } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"))

    if (!userData) return;

    const decodedToken = decode(userData.token);

    if (decodedToken.exp * 1000 < new Date().getTime()) {
      localStorage.clear();
      return;
    }

    setUser(userData);

  }, []);

  return [user, setUser];
};

export default useAuth;
