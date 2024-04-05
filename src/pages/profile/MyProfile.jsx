import React, { useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button, Card, Modal } from "react-bootstrap";
import "../../stylesheets/profile.css";
import { useAuth } from "../../auth/AuthProviders";
import { useMutation, useQuery } from "react-query";
import { Form } from "react-bootstrap";
import { getByIdUser } from "../../services/UserService";
import { Link } from "react-router-dom";
import { create } from "../../services/UserService";
import "../../stylesheets/button.css";
import Swal from "sweetalert2";

function MyProfile() {
  const { user } = useAuth();

  const [userId, setUserId] = useState(0);

  const {
    isLoading: userLoading,
    data: userData,
    isError: userError,
  } = useQuery(["users", userId], () => getByIdUser(userId), {
    enabled: !!userId, 
  });
  useEffect(() => {
    if (user) {
      for (const claim in user) {
        if (claim.endsWith("/nameidentifier")) {
          console.log(user[claim]);
          setUserId(user[claim]);
          setEditingUser(user[claim]);
        }
      }
    }
  }, [user]);
  const userDni = useRef(0);
  const userName = useRef(null);
  const userLastName1 = useRef(null);
  const userLastName2 = useRef(null);
  const userPhoneNumber = useRef(0);
  const userLicenseUNA = useRef(0);
  const userEmail = useRef(null);
  const userPassword = useRef(null);
  const userState = useRef(true);

  const handleEditClick = (UserId) => {
    const userToEdit = userData;
    setEditingUser(userToEdit);
    setShowEditModal(true);
  };

  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const [editingUser, setEditingUser] = useState(userId);

  const mutation = useMutation("user", create, {
    onSettled: () => queryClient.invalidateQueries("users"),
    mutationKey: "user",
  });

  const validateUpdateUserFields = (dni,name, lastName1, lastName2, licenseUNA, phoneNumber, email) => {
    // Validación de la cédula
    if (dni.length < 9 || dni.length > 15 || !/^[0-9a-zA-Z]+$/.test(dni)) {
      return 'La cédula debe tener una longitud entre 9 y 15 dígitos';
    }

    // Validación del nombre
    if (!name.trim() || !/^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\u0300-\u036F\s]+$/.test(name)) {
      return 'El nombre es requerido y solo puede contener letras';
    }

    // Validación del primer apellido
    if (!lastName1.trim() || !/^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\u0300-\u036F\s]+$/.test(lastName1)) {
      return 'El primer apellido es requerido y solo puede contener letras';
    }

    // Validación del segundo apellido
    if (!lastName2.trim() || !/^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\u0300-\u036F\s]+$/.test(lastName2)) {
      return 'El segundo apellido es requerido y solo puede contener letras';
    }

    if (!licenseUNA.trim() || !  /^[0-9]{6}$/.test(licenseUNA)) {
      return 'La licencia debe contener 6 dígitos numerales';
    }

    // Validación del número de teléfono
    const phoneNumberRegex = /^\d{8}$/;
    if (!phoneNumber.trim() || !phoneNumberRegex.test(phoneNumber)) {
      return 'El teléfono debe contener exactamente 8 dígitos';
    }

    // Validación del correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.trim() || !emailRegex.test(email)) {
      return 'El correo electrónico no es válido';
    }


    return null;
  };


  const handleUpdate = () => {

    const validationError = validateUpdateUserFields(
      userDni.current.value,
      userName.current.value,
      userLastName1.current.value,
      userLastName2.current.value,
      userLicenseUNA.current.value,
      userPhoneNumber.current.value,
      userEmail.current.value,
    );

    if (validationError) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: validationError,
      });
      return;
    }
   

    let updatedUser = {
      id: editingUser.id,
      dni: parseInt(userDni.current.value),
      name: userName.current.value,
      lastName1: userLastName1.current.value,
      lastName2: userLastName2.current.value,
      phoneNumber: parseInt(userPhoneNumber.current.value),
      licenseUNA: parseInt(userLicenseUNA.current.value),
      email: userEmail.current.value,

      state: editingUser.state,
    };

    try{

      mutation.mutateAsync(updatedUser);
      setShowEditModal(false);
    
  
    Swal.fire({
      icon: 'success',
      title: 'Usuario creado',
      text: 'El usuario se ha editado exitosamente',
    });
  
    setTimeout(() => {
      window.location.reload();
    }, 2000); 
    
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al editar el usuario',
    });
  }
    };
  

  if (userLoading) {
    <div>Cargando...</div>;
  }
  if (userError) {
    <div>Error...</div>;
  }

  return (
    <>
      <Container className="d-flex container-profile">
        <Card className="shadow card-profile">
          <Row>
            <Col sm md={4} className="">
              <div className="d-flex flex-column justify-content-center align-items-center py-5">
                <img
                  className="img-profile mb-4"
                  src="https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Free-Download.png"
                  alt="perfil"
                />
                <h4>
                  {userData ? `${userData.name} ${userData.lastName1}` : ""}
                </h4>
                <p>{userData ? userData.email : ""}</p>
              </div>
            </Col>
            <Col sm md={8}>
              <div className="p-4 ">
                <h3>Datos generales</h3>
                <Row className="mb-5">
                  <Col sm>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Cédula</Form.Label>
                      <Form.Control
                        type="string"
                        value={userData ? userData.dni : ""}
                        readOnly
                        disabled
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Licencia UNA</Form.Label>
                      <Form.Control
                        type="string"
                        value={userData ? userData.licenseUNA : ""}
                        readOnly
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col sm>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Nombre completo</Form.Label>
                      <Form.Control
                        type="string"
                        value={
                          userData
                            ? `${userData.name} ${userData.lastName1} ${userData.lastName2}`
                            : ""
                        }
                        readOnly
                        disabled
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Número de teléfono</Form.Label>
                      <Form.Control
                        type="number"
                        value={userData ? userData.phoneNumber : ""}
                        readOnly
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end gap-2 buttons-profile">
                <Button className="Profilebutton"
                   onClick={() => handleEditClick(userId)}>
                    <i class="bi bi-pencil"></i> Editar mis datos
                  </Button >
                  <Link to={`/profile/requests`}>
                    <Button className="Profilebutton" >
                      <i class="bi bi-card-text"></i> Ver mis solicitudes
                    </Button>
                  </Link>
                  <Link to={`/ChangePassword`}>
                    <Button className="Profilebutton">
                      <i class="bi bi-shield-lock"></i> Cambiar contraseña
                    </Button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>

      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Label>Cédula</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese la cédula"
                  defaultValue={editingUser ? editingUser.dni : ""}
                  ref={userDni}
                />

                <Form.Label>Primer Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el primer apellido"
                  defaultValue={editingUser ? editingUser.lastName1 : ""}
                  ref={userLastName1}
                />

                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el telefono"
                  defaultValue={editingUser ? editingUser.phoneNumber : ""}
                  ref={userPhoneNumber}
                />
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el correo"
                  defaultValue={editingUser ? editingUser.email : ""}
                  ref={userEmail}
                />
              </Col>
              <Col>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el nombre"
                  defaultValue={editingUser ? editingUser.name : ""}
                  ref={userName}
                />

                <Form.Label>Segundo Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el segundo apellido"
                  defaultValue={editingUser ? editingUser.lastName2 : ""}
                  ref={userLastName2}
                />
                <Form.Label>Licencia UNA</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese la licencia universitaria"
                  defaultValue={editingUser ? editingUser.licenseUNA : ""}
                  ref={userLicenseUNA}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button  className="buttonCancel" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button  className= "buttonSave" variant="success" onClick={handleUpdate}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MyProfile;
