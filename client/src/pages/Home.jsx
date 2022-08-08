import { useEffect } from "react";
import Container from "react-bootstrap/Container";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import UserManagement from "./UserManagement";

const Home = () => {
 const {user} = useContext(AuthContext)
    const navigate = useNavigate()
    console.log(user)

  return (
    <>
    <NavBar user={user}/>
    <Container>
      {user && (
        <>
          <h1>Home</h1>
          <h2>{user.email}</h2>
          <h2>{user.password}</h2>
          <h2>{user.role}</h2>
          <h2>{user.isActive}</h2>
        </>
      )}
      {user.role === 'admin' && <UserManagement user={user} />}

    </Container>
    </>
  );
};

export default Home;
