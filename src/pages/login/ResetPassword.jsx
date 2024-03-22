import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../../stylesheets/generalDesign.css"


function ResetPassword() {
  const [newPass, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState(""); 
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
 
  

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
    
    if (!newPass || !confirmPassword) {
      MySwal.fire({
        icon: "error",
        text: "Por favor, complete los campos.",
      });
      return;
    }
    
    if (newPass !== confirmPassword) {
      MySwal.fire({
        icon: "error",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }
    try {
      const response = await axios.post("https://controldegirasapi20240320221516.azurewebsites.net/api/Users/resetPassword", {
        resetToken, 
        newPass,
        confirmPassword,
      });
      MySwal.fire({
        icon: "success",
        title: "¡Contraseña restablecida con éxito!",
        text: response.data,
      });
      navigate("/login");
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
      <h2 className="my-4 custom-heading">Restablecimiento de contraseña</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="newPassword">
      
          <div className="d-flex align-items-center mb-3">
            <Form.Control
              type={showPasswords ? 'text' : 'password'}
              placeholder="Ingrese su nueva contraseña"
              value={newPass}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: '400px' }}
            />
            
          </div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
        
          <Form.Control
            type={showPasswords ? 'text' : 'password'}
            placeholder="Confirme su nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '400px' }}
          />
        </Form.Group>

        <Form.Check
              type="checkbox"
              id="showPasswordsCheckbox"
              label="Mostrar contraseñas"
              className="custom-checkbox-color" 
              checked={showPasswords}
              onChange={() => setShowPasswords(!showPasswords)}
            />

        <Button type="submit" className="custom-button" style={{ marginTop: '20px'}} >
          Guardar
        </Button>
      </Form>
    </div>
  );
}

export default ResetPassword;
