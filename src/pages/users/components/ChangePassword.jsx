import React, { useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { changePassword } from "../../../services/UserService";
import "../../../stylesheets/button.css";
import "../../../stylesheets/generalDesign.css";
import Swal from "sweetalert2";

function ChangePassword() {
  const email = useRef(null);
  const oldPassword = useRef(null);
  const newPassword = useRef(null);

  const mutation = useMutation("user", changePassword);

  const handleSave = () => {
    if (!email.current.value) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El correo electrónico es requerido",
      });
      return;
    }

    if (!oldPassword.current.value.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña anterior es requerida",
      });
      return;
    }

    if (!newPassword.current.value.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe digitar una contraseña nueva",
      });
      return;
    }

    let newPasswordDto = {
      email: email.current.value,
      oldPassword: oldPassword.current.value,
      newPassword: newPassword.current.value,
    };
    mutation.mutateAsync(newPasswordDto).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 2000); 

      Swal.fire({
        icon: 'success',
        title: 'Contraseña cambiada',
        text: 'La contraseña se ha cambiado exitosamente',
      });
    });
  };
  return (
    <Container className="container-fluid">
      <h2 className="h3 mb-2 text-gray-800 custom-heading">
        Cambio de contraseña
      </h2>
      <p className="mb-4">
        Escriba los datos respectivos para realizar el cambio de contraseña
      </p>
      <div className="p-4 card shadow mb-4">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo"
              ref={email}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPasswordA">
            <Form.Label>Contraseña anterior</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña antigua"
              ref={oldPassword}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPasswordN">
            <Form.Label>Contraseña nueva</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña nueva "
              ref={newPassword}
            />
          </Form.Group>

          <Button className="buttonCancel" style={{ marginRight: "20px" }}>
            <Link to="/profile">Regresar </Link>
          </Button>

          <Button
            onClick={handleSave}
            className="mr-1 buttonSave"
            variant="success"
          >
            Guardar
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default ChangePassword;
