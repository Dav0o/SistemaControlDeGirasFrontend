import React, { useEffect } from "react";
import "../../stylesheets/login.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuth } from "../../auth/AuthProviders";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";


function Login() {
  const { setNewUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const MySwal = withReactContent(Swal);

  const [showPassword, setShowPassword] = useState(false);
  

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    // Prevent the default submit and page reload
    e.preventDefault();

    // Handle validations
    axios
      .post("https://controldegirasapi20240320221516.azurewebsites.net//api/Users/login", { email, password })
      .then((response) => {
        localStorage.setItem("token", response.data);
        setNewUser(response.data);
        console.log(localStorage);

        setLoggedIn(true);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Sesión iniciada con éxito!",
          showConfirmButton: false,
          timer: 1500,
        });
        // Handle response
      })
      .catch((error) => {
        MySwal.fire({
          icon: "error",
          text: "¡Algo salió mal!",
        });
        if (error.response) {
          console.log(error.response);
          console.log("server responded");
        } else {
          console.log(error);
        }
      });
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
      window.location.reload();
    }
  });

  return (
    
      <MDBContainer className="my-5" >
        <form action="" id="login" method="post" onSubmit={handleSubmit}>
          <MDBCard className="d-flex">
            <MDBRow className="g-0">
              <MDBCol md="6">
                <MDBCardImage
                  src="https://www.chorotega.una.ac.cr/images/RESIDENCIAS/Mesa1%201.jpg"
                  alt="login form"
                  className="rounded-start fluid w-100 h-100"
                />
              </MDBCol>

              <MDBCol md="6">
                <MDBCardBody className="d-flex flex-column">
                  <div className="d-flex flex-row mt-2">

                    <span className="h1 fw-bold mb-0">UNA</span>
                  </div>

                  <h5
                    className="fw-normal my-4 pb-3"
                    style={{ letterSpacing: "1px" }}
                  >
                    Inicia sesión en tu cuenta
                  </h5>
                    
                
                  <MDBInput
                    wrapperClass="mb-4"
                    placeholder="Correo electrónico"
                    id="formControlLg"
                    type="email"
                    size="lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                  />

                  <MDBInput
                 
                    placeholder="Contraseña"
                    id="formControl"
                    type={showPassword ? 'text' : 'password'}
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    
                  />

              <Form.Check
              type="checkbox"
              id="showPasswordsCheckbox"
              label="Mostrar contraseña"
              className="ms-2"
              checked={showPassword}
              style={{ marginTop: '20px' }}
              onChange={() => setShowPassword(!showPassword)}
              
            />
                       
                  <Button type="submit" variant="dark" className="button" style={{ marginTop: '20px' }}>
                    Iniciar Sesión
                  </Button>

                  <br />
                  <Link to="/PasswordRecovery" className="small text-muted">
                    ¿Olvidaste tu contraseña?
                  </Link>


                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </form>
      </MDBContainer>
   
  );
}

export default Login;
