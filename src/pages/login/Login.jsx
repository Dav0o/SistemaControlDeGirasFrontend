import React, { useEffect } from "react";
import "../../stylesheets/login.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Login() {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const MySwal = withReactContent(Swal);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    // Prevent the default submit and page reload
    e.preventDefault();

    // Handle validations
    axios
      .post("https://control-de-giras.azurewebsites.net/api/Users/login", { email, password })
      .then((response) => {
        localStorage.setItem("token", response.data);
        console.log(localStorage);
        
        setLoggedIn(true);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Sesión iniciada con éxito!',
          showConfirmButton: false,
          timer: 1500
        })
        // Handle response
      })
      .catch((error) => {
        MySwal.fire({
          icon: "error",
          text: "Algo salio mal!",
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
    }
  });

  return (
    <>
      <div className="sidenav">
        <div className="login-main-text"></div>
      </div>
      <div className="main">
        <div className="col-md-5 col-sm-12 ">
          <div className="login-form  p-4 ">
            <form action="" id="login" method="post" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Correo Electronico</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Correo Electronico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <br />
              <Button type="submit" variant="dark" className="">
                Iniciar Sesión
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
