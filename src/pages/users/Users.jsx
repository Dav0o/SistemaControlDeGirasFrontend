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
  const {  data } = useQuery("users", getUsers, {
    enabled: true,
  }
  );


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
      state: userState.current.valueOf,
    };
    mutation.mutateAsync(newUser);
  };

  const handleEditClick = (UserId) => {
    const userToEdit = data.find((user) => user.id === UserId);
    setEditingUser(userToEdit);
    setShowEditModal(true);
  };

  const [selectedUser, setSelectedUser] = useState(null);


  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const [editingUser, setEditingUser] = useState(null)

  const handleUpdate = () => {
    let updatedUser = {
      id: editingUser.id,
      name: userName.current.value,
      lastName1: userLastName1.current.value,
      lastName2: userLastName2.current.value,
      phoneNumber: userPhoneNumber.current.value,
      licenseUNA: userLicenseUNA.current.value,
      email: userEmail.current.value,
      password: userPassword.current.value,
      state: userState.current.value,
    };
    mutation.mutateAsync(updatedUser)
    .then(response =>{
      console.log('Usuario actualizado exitosamente', response);
    })
    .catch(error =>{
      console.error('Error al actualizar el usuario', error);
    });
    setShowEditModal(false);
  };

  const [showDetailModal, setShowDetailModal] = useState(false);
  const handleCloseDetailModal = () => setShowDetailModal(false);
  const handleShowDetailModal = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
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
                  <Button variant="info" onClick={() => handleShowDetailModal(user)}>Detalles</Button>
                  <Button variant="primary" onClick={() => handleEditClick(user.id)}>Editar</Button>
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
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar 
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar usuario</Modal.Title>
        </Modal.Header>
         <Modal.Body>
          <Form>
            <Row>
              <Col>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el nombre"
              defaultValue={editingUser ? editingUser.name : ''} ref={userName}/>
           
              <Form.Label>Primer apellido</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el primer apellido"
              defaultValue={editingUser ? editingUser.lastName1 : ''} ref={userLastName1}
              />
       
              <Form.Label>Correo electronico</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el correo"
              defaultValue={editingUser ? editingUser.email : ''} ref={userEmail}/>

              <Form.Label>Licencia UNA</Form.Label>
              <Form.Control type="text" placeholder="Ingrese la licencia universitaria"
              defaultValue={editingUser ? editingUser.licenseUNA : ''} ref={userLicenseUNA}
             />

            </Col>
            <Col>
            <Form.Label>Telefono</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el telefono"
              defaultValue={editingUser ? editingUser.phoneNumber : ''} ref={userPhoneNumber}
              />
            
              <Form.Label>Segundo apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el segundo apellido"
                defaultValue={editingUser ? editingUser.lastName2 : ''}
                ref={userLastName2}
              />
  
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la contraseña"
                defaultValue={editingUser ? editingUser.password : ''}
                ref={userPassword}
              />
            
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el estado"
                defaultValue={editingUser ? editingUser.state : ''}
                ref={userState}
              />  
          </Col>
          </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button variant="dark" onClick={handleUpdate}>
            Actualizar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailModal} onHide={handleCloseDetailModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Información del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>Nombre:</strong> {selectedUser.name}</p>
              <p><strong>Primer apellido:</strong> {selectedUser.lastName1}</p>
              <p><strong>Segundo apellido:</strong> {selectedUser.lastName2}</p>
              <p><strong>Telefono:</strong> {selectedUser.phoneNumber}</p>
              <p><strong>Licencia UNA:</strong> {selectedUser.licenseUNA}</p>
              <p><strong>Correo electronico:</strong> {selectedUser.email}</p>
              <p><strong>Contraseña:</strong> {selectedUser.password}</p>
              <p><strong>Estado:</strong> {selectedUser.state}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

  <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item"><a class="page-link" href="#">Anterior</a></li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">Siguiente</a></li>
  </ul>
</nav>
    </>
  );
}

export default Users;
