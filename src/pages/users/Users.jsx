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
import { InputGroup } from "react-bootstrap";

function Users() {
  const userDni = useRef(null);
  const userName = useRef(null);
  const userLastName1 = useRef(null);
  const userLastName2 = useRef(null);
  const userPhoneNumber = useRef(0);
  const userLicenseUNA = useRef(0);
  const userEmail = useRef(null);
  const userPassword = useRef(null);
  const userState = useRef(true);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


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
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_ elementos",
        info: "Mostrando elementos _START_ al _END_ de un total de _TOTAL_ elementos",
        infoEmpty: "Mostrando 0 elementos",
        infoFiltered: "(filtrado de _MAX_ elementos en total)",
        infoPostFix: "",
        loadingRecords: "Cargando...",
        zeroRecords: "No se encontraron elementos",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": activar para ordenar la columna de manera ascendente",
          sortDescending: ": activar para ordenar la columna de manera descendente"
        }
      },

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
          className: "btn btn-info text-light",
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

  //VALIDACIONES
  const validateUserFields = (dni, licenseUNA, name, lastName1, lastName2, phoneNumber, email, password) => {
    // Validación de la cédula
    if (dni.length < 9 || dni.length > 15 || !/^[0-9a-zA-Z]+$/.test(dni)) {
      return 'La cédula debe tener una longitud entre 9 y 15 dígitos';
    }


    if (!licenseUNA.trim() || !  /^[0-9]/.test(licenseUNA)) {
      return 'La licencia es requerida';
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

    // Validación de la contraseña
    if (!password.trim()) {
      return 'La contraseña es requerida';
    }
      else if (password.trim().length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres';
      }


    return null;
  };

  const handleSave = async () => {

    const validationError = validateUserFields(
      userDni.current.value,
      userLicenseUNA.current.value,
      userName.current.value,
      userLastName1.current.value,
      userLastName2.current.value,
      userPhoneNumber.current.value,
      userEmail.current.value,
      userPassword.current.value
    );
  
  
    if (validationError) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: validationError,
      });
      return;
    }

    let newUser = {
      dni: userDni.current.value,
      name: userName.current.value,
      lastName1: userLastName1.current.value,
      lastName2: userLastName2.current.value,
      phoneNumber: parseInt(userPhoneNumber.current.value),
      licenseUNA: parseInt(userLicenseUNA.current.value),
      email: userEmail.current.value,
      password: userPassword.current.value,
      state: true,
    };
    try {
      const result = await mutation.mutateAsync(newUser);
  
      if (result.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.error,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: 'El usuario se ha creado exitosamente',
        }).then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear el usuario',
      });
    }
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


    //VALIDACIONES UPDATE
    const validateUpdateUserFields = (dni,name, lastName1, lastName2, phoneNumber, licenseUNA, email) => {
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
      userPhoneNumber.current.value,
      userLicenseUNA.current.value,
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
      dni: userDni.current.value,
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
      title: 'Usuario editado',
      text: 'El usuario se ha editado exitosamente',
    });
  
    setTimeout(() => {
      window.location.reload();
    }, 1500); 
    
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al editar el usuario',
    });
  }
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
  /////////////generar contraseña automaticamente///////////////
  const getPassword = () => {
    userPassword.current.value = autoCreate(8);
  };

  function autoCreate(plength) {
    var chars = "abcdefghijklmnopqrstubwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-._*/";
    var password = '';
    for (var i = 0; i < plength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
  }
  /////////////////////////////////////////////////////////////////

  return (
    <>
      <Container className="container-fluid">
        <h2 className="h3 mb-2 text-gray-800 custom-heading">Usuarios</h2>
        <p className="mb-4">Lista de usuarios</p>

        <div className="card shadow mb-4">
          {/* <div className="mb-3">
              <div>Click en el botón para crear un usuario</div>
            </div> */}
          <div>
            <Accordion defaultActiveKey="1">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  Clic en el botón para crear un usuario
                </Accordion.Header>
                <Accordion.Body>
                  <Container>
                    <Row className="mb-2">
                      <Col>
                        <Form.Label htmlFor="inputDNI">Cédula</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder=""
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
                      <Col xs={5}>
                        <Form.Label htmlFor="inputEmail">
                          Correo electrónico
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="example@ex.com"
                          id="inputEmail"
                          ref={userEmail}
                        />
                      </Col>

                      <Col xs={6}>

                        <Form.Label htmlFor="inputPassword">
                          Contraseña
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            id="inputPassword"
                            ref={userPassword}
                            placeholder="Contraseña"
                          />
                          <Button variant="ligth" onClick={togglePasswordVisibility}>
                            {showPassword ? (
                              <i className="bi bi-eye-slash"></i>
                            ) : (
                              <i className="bi bi-eye"></i>
                            )}
                          </Button>
                          
                            <Button onClick={getPassword}  variant="light" >
                              Generar clave
                            </Button>
                          
                        </InputGroup>
                      </Col>
                    </Row>

                    <Button
                      variant="success"
                      className="mt-3 buttonSave"
                      onClick={handleSave}

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
                  <th>Correo Electrónico</th>
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
                        className=" buttonSave btn btn-secondary mr-1 text-light"
                      >
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
                  type="text"
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
                  style={{width:'120%'}}
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
          <Button className="buttonCancel" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button className="buttonSave" variant="success" onClick={handleUpdate}>
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
            <div >
              <p style={{color: 'black'}}>
                <strong>Cédula:</strong> {selectedUser.dni}
              </p>
              <p style={{color: 'black'}}>
                <strong>Nombre:</strong> {selectedUser.name}
              </p>
              <p style={{color: 'black'}}>
                <strong>Primer Apellido:</strong> {selectedUser.lastName1}
              </p>
              <p style={{color: 'black'}}>
                <strong>Segundo Apellido:</strong> {selectedUser.lastName2}
              </p>
              <p style={{color: 'black'}}>
                <strong>Teléfono:</strong> {selectedUser.phoneNumber}
              </p>
              <p style={{color: 'black'}}>
                <strong>Licencia UNA:</strong> {selectedUser.licenseUNA}
              </p>
              <p style={{color: 'black'}}>
                <strong>Correo electrónico:</strong> {selectedUser.email}
              </p>

            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="buttonCancel" onClick={handleCloseDetailModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Users;
