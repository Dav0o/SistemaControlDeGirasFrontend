import React, { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { create, getUsers } from "../../services/UserService";
import Form from "react-bootstrap/Form";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Accordion from "react-bootstrap/Accordion";

import "../../stylesheets/vies.css";

function Users() {
  const userDni = useRef(0);
  const userName = useRef(null);
  const userLastName1 = useRef(null);
  const userLastName2 = useRef(null);
  const userPhoneNumber = useRef(0);
  const userLicenseUNA = useRef(0);
  const userEmail = useRef(null);
  const userPassword = useRef(null);
  const userState = useRef(true);

  const {
    isLoading: loadingUsers,
    data: users,
    isError: errorUsers,
  } = useQuery("users", getUsers, { enabled: true });
  const { data } = useQuery("users", getUsers, {
    enabled: true,
  });
  const queryClient = useQueryClient();

  const mutation = useMutation("user", create, {
    onSettled: () => queryClient.invalidateQueries("users"),
    mutationKey: "user",
  });

  const [dataTable, setDataTable] = useState(null); // Estado para mantener la referencia del DataTable

  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }

    // Inicializa el DataTable después de renderizar los datos

    const newDataTable = new DataTable("#tableUsers", {
      retrieve: true,
      dom: "lfBrtip",
      bLengthChange: false,
      responsive: true,

      buttons: [
        {
          extend: "print",
          title: "Registro Usuarios",
          titleAttr: "Imprimir",
          text: '<i class="fa-solid fa-print" aria-hidden="true"></i>',
          className: "btn btn-info",
          exportOptions: {
            columns: [0, 1, 2, 3, 4],
          },
          customize: function (win) {
            $(win.document.body)
              .find("tableUsers")
              .addClass("compact")
              .css("font-size", "inherit");
            $(win.document.body).find("h1").css("text-align", "center");
            $(win.document.body).css("font-size", "9px");
          },
        },
        {
          extend: "pdf",
          title: "Registro Usuarios",
          titleAttr: "Exportar a PDF",
          text: '<i class="fa-regular fa-file-pdf" aria-hidden="true"></i>',
          className: "btn btn-danger",
          exportOptions: { columns: [0, 1, 2, 3, 4] },
          customize: function (doc) {
            doc.content[1].margin = [100, 0, 100, 0]; //left, top, right, bottom
          },
        },
        {
          extend: "excel",
          title: "Registro Usuarios",
          titleAttr: "Exportar a Excel",
          text: '<i class="fa-solid fa-file-csv"></i>',
          className: "btn btn-success",
          exportOptions: { columns: [0, 1, 2, 3, 4] },
        },
      ],
    });

    // Actualiza el estado para mantener la referencia del DataTable
    setDataTable(newDataTable);
  }, [data]); // Vuelve a inicializar el DataTable cuando los datos cambien

  const handleSave = () => {
    let newUser = {
      dni: parseInt(userDni.current.value),
      name: userName.current.value,
      lastName1: userLastName1.current.value,
      lastName2: userLastName2.current.value,
      phoneNumber: parseInt(userPhoneNumber.current.value),
      licenseUNA: parseInt(userLicenseUNA.current.value),
      email: userEmail.current.value,
      password: userPassword.current.value,
      state: true,
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
        <p className="mb-4">Lista de usuarios</p>

        <div className="card shadow mb-4">
          {/* <div className="mb-3">
              <div>Click en el botón para crear un usuario</div>
            </div> */}
          <div>
            <Accordion defaultActiveKey="1">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  Click en el botón para crear un usuario
                </Accordion.Header>
                <Accordion.Body>
                  <Container>
                    <Row className="mb-2">
                      <Col>
                        <Form.Label htmlFor="inputDNI">Cédula</Form.Label>
                        <Form.Control
                          type="number"
                          id="inputDNI"
                          ref={userDni}
                        />
                      </Col>
                      <Col>
                        <Form.Label htmlFor="inputLicenseUNA">
                          Licencia UNA
                        </Form.Label>
                        <Form.Control
                          type="number"
                          id="inputLicenseUNA"
                          ref={userLicenseUNA}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <Form.Label htmlFor="inputName">Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          id="inputName"
                          ref={userName}
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
                      </Col>
                      <Col>
                        <Form.Label htmlFor="inputLastName2">
                          Segundo Apellido
                        </Form.Label>
                        <Form.Control
                          type="text"
                          id="inputLastName2"
                          ref={userLastName2}
                        />
                      </Col>
                    </Row>

                    <Form.Label htmlFor="inputPhoneNumber">Teléfono</Form.Label>
                    <Form.Control
                      type="number"
                      id="inputPhoneNumber"
                      ref={userPhoneNumber}
                    />
                    <Row>
                      <Col>
                        <Form.Label htmlFor="inputEmail">
                          Correo electrónico
                        </Form.Label>
                        <Form.Control
                          type="email"
                          id="inputEmail"
                          ref={userEmail}
                        />
                      </Col>
                      <Col>
                        <Form.Label htmlFor="inputPassword">
                          Contraseña
                        </Form.Label>
                        <Form.Control
                          type="password"
                          id="inputPassword"
                          ref={userPassword}
                        />
                      </Col>
                    </Row>

                    <Button
                      variant="primary"
                      onClick={handleSave}
                      className="mt-3"
                    >
                      Guardar
                    </Button>
                  </Container>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          <div className="card-body">
            <Table responsive className="display nowrap" id="tableUsers">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Cédula</th>
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
                    <td>{user.dni}</td>
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
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        variant="info"
                        className="bg-gradient-info text-light mr-1"
                        onClick={() => handleShowDetailModal(user)}
                      >
                        <i className="bi bi-info-square"></i>
                      </Button>

                      <Link
                        to={`/users/UserRole/${user.id}`}
                        className="btn btn-secondary mr-1 text-light"
                      >
                        <i className="bi bi-person-gear"></i>
                      </Link>
                      <Link to={`/ChangePassword`}>
                        <Button
                          variant="success"
                          className="bg-gradient-info text-light mr-1"
                        >
                          <i class="bi bi-shield-lock"></i>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
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
                <strong>Cédula:</strong> {selectedUser.dni}
              </p>
              <p>
                <strong>Nombre:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Primer Apellido:</strong> {selectedUser.lastName1}
              </p>
              <p>
                <strong>Segundo Apellido:</strong> {selectedUser.lastName2}
              </p>
              <p>
                <strong>Teléfono:</strong> {selectedUser.phoneNumber}
              </p>
              <p>
                <strong>Licencia UNA:</strong> {selectedUser.licenseUNA}
              </p>
              <p>
                <strong>Correo electrónico:</strong> {selectedUser.email}
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
