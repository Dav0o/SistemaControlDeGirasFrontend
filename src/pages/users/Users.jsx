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
import { useEffect } from "react";
import { Link } from "react-router-dom"; import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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

  const {
    isLoading: loadingUsers,
    data: users,
    isError: errorUsers,
  } = useQuery("users", getUsers, { enabled: true });
  const { data } = useQuery("users", getUsers, {
    enabled: true,
  });

  const mutation = useMutation("users", create);
  const MySwal = withReactContent(Swal);

  {
    mutation.isError
      ? MySwal.fire({
        icon: "error",
        text: "Algo salio mal!",
      }).then(mutation.reset)
      : null;
  }
  {
    mutation.isSuccess
      ? MySwal.fire({
        icon: "success",
        title: "Usuario creado con exito!",
        showConfirmButton: false,
        timer: 1500,
      })
      : null;
  }
  const [dataTable, setDataTable] = useState(null); // Estado para mantener la referencia del DataTable

  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }

    // Inicializa el DataTable después de renderizar los datos
    const newDataTable = new DataTable('#tableUsers', {
      retrieve: true,
      responsive: true,
      dom: 'Bfrtp',
      buttons: [
        {
          extend: 'excelHtml5',
          text: '<i class="fa-solid fa-file-csv"></i>',
          titleAttr: 'Exportar a Excel',
          className: 'btn btn-success',
        },
        {
          extend: 'pdfHtml5',
          text: '<i class="fa-regular fa-file-pdf"></i>',
          titleAttr: 'Exportar a PDF',
          className: 'btn btn-danger',
        },
        {
          extend: 'print',
          text: '<i class="fa-solid fa-print"></i>',
          titleAttr: 'Imprimir',
          className: 'btn btn-info',
        },
      ],

    });


    // Actualiza el estado para mantener la referencia del DataTable
    setDataTable(newDataTable);
  }, [data]); // Vuelve a inicializar el DataTable cuando los datos cambien


  const handleSave = () => {
    let newUser = {
      name: userName.current.value,
      lastName1: userLastName1.current.value,
      lastName2: userLastName2.current.value,
      phoneNumber: parseInt(userPhoneNumber.current.value),
      licenseUNA: parseInt(userLicenseUNA.current.value),
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

  const [editingUser, setEditingUser] = useState(null);

  const handleUpdate = () => {
    let updatedUser = {
      id: editingUser.id,
      name: userName.current.value,
      lastName1: userLastName1.current.value,
      lastName2: userLastName2.current.value,
      phoneNumber: parseInt(userPhoneNumber.current.value),
      licenseUNA: parseInt(userLicenseUNA.current.value),
      email: userEmail.current.value,
      password: userPassword.current.value,
      state: userState.current.value,
    };
    mutation
      .mutateAsync(updatedUser)

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
      <Container className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Usuarios</h1>
        <p class="mb-4">Lista de usuarios</p>

        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="d-flex justify-content-between">
              <div>Clik en el boton para crear un usuario</div>
              <Button
                variant="success"
                className="bg-gradient-success text-light
               "
                onClick={handleShow}
              >
                {" "}
                <i class="bi bi-plus-square"></i>
              </Button>
            </div>
          </div>
          <div className="card-body">
            <Table striped="columns" id="tableUsers">
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
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                      {user.lastName1} {user.lastName2}
                    </td>
                    <td>{user.email}</td>
                    <td>

                      <Button
                        variant="warning"
                        className="bg-gradient-warning mr-1 text-light"
                        onClick={() => handleEditClick(user.id)}
                      >
                        <i class="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        variant="info"
                        className="bg-gradient-info text-light"
                        onClick={() => handleShowDetailModal(user)}
                      >
                        <i class="bi bi-info-square"></i>
                      </Button>
                         
                      <Link 
                      to={`/users/UserRole/${user.id}`} className="btn btn-warning mr-1 text-light">
                        <i className="bi bi-person-gear"></i>
                      </Link>
                     
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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

                <Form.Label htmlFor="inputLastName2">
                  Segundo Apellido
                </Form.Label>
                <Form.Control
                  type="text"
                  id="inputLastName2"
                  ref={userLastName2}
                />

                <Form.Label htmlFor="inputEmail">Correo Electronico</Form.Label>
                <Form.Control type="email" id="inputEmail" ref={userEmail} />

                <Form.Label htmlFor="inputLicenseUNA">Licencia UNA</Form.Label>
                <Form.Control
                  type="number"
                  id="inputLicenseUNA"
                  ref={userLicenseUNA}
                />
              </Col>
              <Col>
                <Form.Label htmlFor="inputLastName1">
                  Primer Apellido
                </Form.Label>
                <Form.Control
                  type="text"
                  id="inputLastName1"
                  ref={userLastName1}
                />

                <Form.Label htmlFor="inputPhoneNumber">Telefono</Form.Label>
                <Form.Control
                  type="number"
                  id="inputPhoneNumber"
                  ref={userPhoneNumber}
                />

                <Form.Label htmlFor="inputPassword">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  id="inputPassword"
                  ref={userPassword}
                />

                <Form.Label htmlFor="inputState">Estado</Form.Label>
                <Form.Control type="text" id="inputState" ref={userState} />
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
                <Form.Control
                  type="text"
                  placeholder="Ingrese el nombre"
                  defaultValue={editingUser ? editingUser.name : ""}
                  ref={userName}
                />

                <Form.Label>Segundo apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el segundo apellido"
                  defaultValue={editingUser ? editingUser.lastName2 : ""}
                  ref={userLastName2}
                />

                <Form.Label>Correo electronico</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el correo"
                  defaultValue={editingUser ? editingUser.email : ""}
                  ref={userEmail}
                />

                <Form.Label>Licencia UNA</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese la licencia universitaria"
                  defaultValue={editingUser ? editingUser.licenseUNA : ""}
                  ref={userLicenseUNA}
                />
              </Col>
              <Col>
                <Form.Label>Primer apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el primer apellido"
                  defaultValue={editingUser ? editingUser.lastName1 : ""}
                  ref={userLastName1}
                />

                <Form.Label>Telefono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el telefono"
                  defaultValue={editingUser ? editingUser.phoneNumber : ""}
                  ref={userPhoneNumber}
                />

                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese la contraseña"
                  defaultValue={editingUser ? editingUser.password : ""}
                  ref={userPassword}
                />

                <Form.Label>Estado</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el estado"
                  defaultValue={editingUser ? editingUser.state : ""}
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
              <p>
                <strong>Nombre:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Primer apellido:</strong> {selectedUser.lastName1}
              </p>
              <p>
                <strong>Segundo apellido:</strong> {selectedUser.lastName2}
              </p>
              <p>
                <strong>Telefono:</strong> {selectedUser.phoneNumber}
              </p>
              <p>
                <strong>Licencia UNA:</strong> {selectedUser.licenseUNA}
              </p>
              <p>
                <strong>Correo electronico:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Estado:</strong> {selectedUser.state}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Users;
