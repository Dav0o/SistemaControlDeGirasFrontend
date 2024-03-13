import React, { useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
    <div className="container">
      <h2 className="my-4">Recuperación de Contraseña</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="Email">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingrese su correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
    </div>
  );
}

export default PasswordRecovery;
