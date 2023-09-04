import React, { useEffect } from "react";
import "../../stylesheets/login.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    // Prevent the default submit and page reload
    e.preventDefault();

    // Handle validations
    axios
      .post("https://localhost:7023/api/Users/login", { email, password })
      .then((response) => {
        localStorage.setItem('token', response.data)
        console.log(localStorage);
        setToken(response.data);
        setLoggedIn(true);
        // Handle response
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log("server responded");
        } else {
          console.log(error);
        }
      });
  };

  useEffect(() =>{
    if(loggedIn){
        navigate("/home");
    }
  })
  

  return (
    <>
      <div className="sidenav">
        <div className="login-main-text">
          
        </div>
      </div>
      <div className="main">
        <div className="col-md-6 col-sm-12">
          <div className="login-form">
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
              <button type="submit" className="btn btn-black">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
