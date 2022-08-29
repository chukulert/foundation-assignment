import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";

const Login = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  let navigate = useNavigate();
  const { logIn } = useContext(AuthContext);
  const { state } = useLocation();
  const {setToastMsg, setShowToast} = useContext(ToastContext)

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await logIn({
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      })
        if(user) navigate(state?.path || "/");
        // setToastMessage("You are successfully logged in.")
    } catch (error) {
      setToastMsg(error.response.data.message);
      setShowToast(true)
    }
  };

  return (
    <>
      <Container>
        <h1>Login</h1>
        <Form onSubmit={handleLoginSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <FloatingLabel
              controlId="floatingUsername"
              label="Username"
              className="text-muted"
            >
              <Form.Control
                type="username"
                placeholder="Username"
                required
                ref={usernameRef}
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              className="text-muted"
            >
              <Form.Control
                type="password"
                placeholder="Password"
                required
                ref={passwordRef}
              />
            </FloatingLabel>
          </Form.Group>
          <div className="text-danger ml-3">
          {/* {error} */}
          </div>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        
        </Form>
      </Container>
    </>
  );
};

export default Login;
