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

function MyProfile() {
  const { user } = useAuth();

  const [userId, setUserId] = useState(0);

  const {
    isLoading: userLoading,
    data: userData,
    isError: userError,
  } = useQuery(["users", userId], () => getByIdUser(userId));

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

  const handleUpdate = () => {
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

    mutation.mutateAsync(updatedUser);
  };

  if (userLoading) {
    <div>isLoading...</div>;
  }
  if (userError) {
    <div>isError...</div>;
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
