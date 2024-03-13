import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function ResetPassword() {
  const [newPass, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(""); 
  const MySwal = withReactContent(Swal);


  useEffect(() => {
    // Obtener el token de la URL cuando se monta el componente
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setResetToken(token);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPassword) {
      MySwal.fire({
        icon: "error",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }
    try {
      const response = await axios.post("https://localhost:7023/api/Users/resetPassword", {
        resetToken, 
        newPass,
        confirmPassword,
      });
      MySwal.fire({
        icon: "success",
        title: "¡Contraseña restablecida con éxito!",
        text: response.data,
      });
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        text: "Ocurrió un error al restablecer la contraseña.",
      });
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Restablecimiento de Contraseña</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="newPassword">
          <Form.Label>Nueva Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingrese su nueva contraseña"
            value={newPass}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirme su nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Guardar
        </Button>
      </Form>
    </div>
  );
}

export default ResetPassword;
