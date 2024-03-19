import React, { useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../stylesheets/generalDesign.css"
import { Link } from "react-router-dom";

function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const MySwal = withReactContent(Swal);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7023/api/Users/forgot", { email });
      if (response.data !== "Usuario no encontrado.") {
        MySwal.fire({
          icon: "success",
          text: "Se le ha enviado un correo electrónico para el restablecimiento de contraseña.",
        });
      } else {
        MySwal.fire({
          icon: "error",
          text: "Usuario no encontrado.",
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        text: "¡Algo salió mal!",
      });
    }
  };

  return (
    <div className="container" >
      <h2 className="my-4 custom-heading">Recuperación de contraseña</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="Email" >
          <Form.Label className="custom-label"  ></Form.Label>
          <Form.Control
            type="email"
            placeholder="Digita tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '400px' }}
          />
        </Form.Group>

        <Button type="submit" className="custom-button" style={{ marginRight: '20px' }}>
          Enviar
        </Button>

        <Button  variant= 'ligth' className="buttonGray">
          <Link to="/login">Regresar </Link>
        </Button>
      </Form>
    </div>
  );  
}

export default PasswordRecovery;
