import React, { useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { changePassword } from "../../../services/UserService";
import "../../../stylesheets/button.css";
import "../../../stylesheets/generalDesign.css";

function ChangePassword() {
    const email = useRef(null);
    const oldPassword = useRef(null);
    const newPassword = useRef(null);

  const mutation = useMutation("user", changePassword, {
    onSettled: () => queryClient.invalidateQueries("users"),
    mutationKey: "user",
  });

  const handleSave = () => {
    let newPasswordDto = {
        email:email.current.value,
        oldPassword:oldPassword.current.value,
        newPassword: newPassword.current.value
    }
    mutation.mutateAsync(newPasswordDto);
  }
  return (
    <Container className="container-fluid">
      <h2 className="h3 mb-2 text-gray-800 custom-heading">Cambio de contraseña</h2>
      <p className="mb-4">
        Escriba los datos respectivos para realizar el cambio de contraseña
      </p>
      <div className="p-4 card shadow mb-4">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control type="email" placeholder="Ingrese su correo" ref={email}/>
            <Form.Text className="text-muted">
              
            </Form.Text>
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
         
          <Button className="buttonCancel" style={{marginRight: '20px'}}>
          <Link to="/profile">Regresar </Link>
        </Button>

          <Button onClick={handleSave} className="mr-1 buttonSave" variant="success">
            Guardar
          </Button>

         
          
        </Form>
      </div>
    </Container>
  );
}

export default ChangePassword;
