import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { user, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" >
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
            {user && user.role === "admin" && (
              <Nav.Link as={Link} to="user-management">
                User
              </Nav.Link>
            )}
            {user && user.role === "admin" && (
              <Nav.Link as={Link} to="group-management">
                Group
              </Nav.Link>
            )}
            {user && <Nav.Link onClick={logout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
