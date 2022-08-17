import { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const NavBar = () => {
  const { user, signOut } = useContext(AuthContext);
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(user) {
    user.groups?.forEach((group) => {
      if (group.name === "admin") setAdmin(true);
    });}
  }, [user]);

  const logout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="home">
          {user?.username}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav fill defaultActiveKey="home">
            <Nav.Link as={Link} to="home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="profile">
              Profile
            </Nav.Link>
            {user && admin && (
              <Nav.Link as={Link} to="user-management">
                User
              </Nav.Link>
            )}
            {user && admin && (
              <Nav.Link as={Link} to="group-management">
                Group
              </Nav.Link>
            )}
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
