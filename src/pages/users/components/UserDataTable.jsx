import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "react-data-table-component";
import { useQuery } from "react-query";
import { getUsers } from "../../../services/UserService";
import "../../../stylesheets/DataTables/userDataTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";


function UserDataTable() {

  const columns = [
    {
      name: "Id",
      selector: "id",
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Apellido",
      selector: (row) => row.lastName1,
      sortable: true,
    },
    {
      name: "Correo electronico",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div>
          <button onClick={() => handleEdit(row.id)} className="boton-accionEdit">
            Editar
          </button>
          <button onClick={() => handleDetails(row.id)} className="boton-accionDetails">
            Ver detalles
          </button>
        </div>
      ),
    },
  ];
  
  const paginacionOpciones = {
    rowsPerPageText: "Filas por Página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };
  
  const [busqueda, setBusqueda] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { isLoading, data, isError } = useQuery("users", getUsers, {
    enabled: true,
  });


  const userName = useRef(null);
  const userLastName1 = useRef(null);
  const userLastName2 = useRef(null);
  const userPhoneNumber = useRef(0);
  const userLicenseUNA = useRef(0);
  const userEmail = useRef(null);
  const userPassword = useRef(null);
  const userState = useRef(true);

  const onChange = (e) => {
    setBusqueda(e.target.value);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
      .then(response => {
        console.log('Usuario actualizado exitosamente', response);
      })
      .catch(error => {
        console.error('Error al actualizar el usuario', error);
      });
    setShowModal(false);
  };

  
  const handleEdit = (userId) => {
    const userToEdit = data.find((user) => user.id === userId);

    if (userToEdit) {
      setEditingUser(userToEdit);
      openModal();
      console.log(`Editar usuario con ID ${userId}`);
    }
  };


  // Filtrar los datos en función de la búsqueda (debe adaptarse a tus criterios de filtrado)
  const filteredData = data.filter((user) => {
    return (
      user.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      user.lastName1.toLowerCase().includes(busqueda.toLowerCase()) ||
      user.email.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <div className="barraBusqueda">
        <input
          type="text"
          placeholder="Buscar"
          className="textField"
          name="busqueda"
          value={busqueda}
          onChange={onChange}
        />
        <button type="button" className="btnBuscar">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {/* Modal de edición */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form>
            <Row>
              <Col>
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el nombre"
              defaultValue={editingUser ? editingUser.name : ''} ref={userName}/>

                 
              <Form.Label>Segundo apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el segundo apellido"
                defaultValue={editingUser ? editingUser.lastName2 : ''}
                ref={userLastName2}
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
            <Form.Label>Primer apellido</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el primer apellido"
              defaultValue={editingUser ? editingUser.lastName1 : ''} ref={userLastName1}
              />

            <Form.Label>Telefono</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el telefono"
              defaultValue={editingUser ? editingUser.phoneNumber : ''} ref={userPhoneNumber}
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Actualizar
          </Button>
        </Modal.Footer>
      </Modal>
   

      {/* Componente DataTable con datos filtrados */}
      <DataTable
        columns={columns}
        data={filteredData}
        title="Usuarios"
        pagination
        paginationComponentOptions={paginacionOpciones}
        fixedHeader
        fixedHeaderScrollHeight="600px"
        noDataComponent={<span>No se encontró ningún registro</span>}
      />
    </div>
  );
}

export default UserDataTable;
