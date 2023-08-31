import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMutation, useQuery } from "react-query";
import { create, getUsers } from "../../services/UserService";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

function Users() {
  const userName = useRef(null);
  const userLastName1 = useRef(null);
  const userLastName2 = useRef(null);
  const userPhoneNumber = useRef(0);
  const userLicenseUNA = useRef(0);
  const userEmail = useRef(null);
  const userPassword = useRef(null);
  const userState = useRef(true);

  const [modalCreate, setModalCreate] = useState(false);

  const handleClose = () => setModalCreate(false);
  const handleShow = () => setModalCreate(true);

  const { isLoading: loadingUsers, data:users, isError:errorUsers} = useQuery("users", getUsers, {enabled: true});


  const mutation = useMutation("users", create);

  const handleSave = () => {
    let newUser = {
      name: userName.current.value,
      lastName1: userLastName1.current.value,
      lastName2: userLastName2.current.value,
      phoneNumber: userPhoneNumber.current.valueOf,
      licenseUNA: userLicenseUNA.current.valueOf,
      email: userEmail.current.value,
      password: userPassword.current.value,
      state: userState.current.value,
    };
    mutation.mutateAsync(newUser);

    
  };

  if (loadingUsers) {
    return <div>Loading...</div>;
  }

  if (errorUsers) {
    return <div>Error</div>;
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h2>Usuario</h2>
          </Col>
          <Col>
            <Button color="success" onClick={handleShow}>
              {" "}
              Crear
            </Button>
          </Col>
        </Row>
        <br />
        <div>
          <Table striped="columns">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Correo Electronico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) =>(
                  <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.lastName1} {user.lastName2}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button variant="info">
                      <Link to={`/users/${user.id}`}>
                      Detalles
                      </Link>
                      
                      </Button>
                    <Button variant="primary">Editar</Button>
                    
                  </td>
                </tr>
              ))}
              
              
              
            </tbody>
          </Table>
        </div>
      </Container>

      <Modal show={modalCreate} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <Form.Label htmlFor="inputName">Nombre</Form.Label>
                <Form.Control type="text" id="inputName" ref={userName} />

                <Form.Label htmlFor="inputLastName1">
                  Primer Apellido
                </Form.Label>
                <Form.Control
                  type="text"
                  id="inputLastName1"
                  ref={userLastName1}
                />

                <Form.Label htmlFor="inputEmail">Correo Electronico</Form.Label>
                <Form.Control type="email" id="inputEmail" ref={userEmail} />

                <Form.Label htmlFor="inputLicenseUNA">Licencia UNA</Form.Label>
                <Form.Control type="number" id="inputLicenseUNA" ref={userLicenseUNA} />
              </Col>
              <Col>
                <Form.Label htmlFor="inputPhoneNumber">Telefono</Form.Label>
                <Form.Control
                  type="number"
                  id="inputPhoneNumber"
                  ref={userPhoneNumber}
                />

                <Form.Label htmlFor="inputLastName2">
                  Segundo Apellido
                </Form.Label>
                <Form.Control
                  type="text"
                  id="inputLastName2"
                  ref={userLastName2}
                />

                <Form.Label htmlFor="inputPassword">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  id="inputPassword"
                  ref={userPassword}
                />

                <Form.Label htmlFor="inputState">Estado</Form.Label>
                <Form.Control
                  type="text"
                  id="inputState"
                  ref={userState}
                />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Users;
