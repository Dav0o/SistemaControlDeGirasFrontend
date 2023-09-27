import React, { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Table, Modal, Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useQuery, useMutation } from "react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import { getByIdVehicle } from "../../../services/VehicleService";
import { create, deleteMaintenance } from "../../../services/MaintenanceService";

import { useEffect } from "react";

function VehicleMaintenances() {
  const { vehicleId } = useParams();
  const { isLoading, data, isError } = useQuery(["vehicles", vehicleId], () =>
    getByIdVehicle(vehicleId)
  );
  const mutation = useMutation("maintenances", create);
  const [maintenances, setMaintenances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  const name = useRef(null);
  const severity = useRef(null);
  const date = useRef(null);
  const type = useRef(null);
  const category = useRef(0);
  const status = useRef(true);
  const description = useRef(null);
 

  const handleSave = () => {
    let newMaintenance = {
      name:  name.current.value,
      severity:  severity.current.value,
      date:  "2023-09-22",
      type: type.current.value,
      category:  0,
      status: true, 
      description: description.current.value,
      vehicleId: vehicleId,
    };
    mutation.mutateAsync(newMaintenance);
    setModalCreate(false);
  };

  const handleEditClick = (MaintenanceId) => {
    const maintenanceToEdit = data.maintenances.find(
      (maintenance) => maintenance.id === MaintenanceId
    );
    setEditingMaintenance(maintenanceToEdit);
    setShowEditModal(true);
  };

  const [modalCreate, setModalCreate] = useState(false);

  const handleCloseFormModal = () => setModalCreate(false);
  const handleShowFormModal = () => setModalCreate(true);

  const [dataTable, setDataTable] = useState(null); // Estado para mantener la referencia del DataTable


  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }

    // Inicializa el DataTable después de renderizar los datos
    const newDataTable = new DataTable("#tableMaintenance", {
      retrieve: true,
      responsive: true,
      dom: "Bfrtp",
      buttons: [
        {
          extend: "excelHtml5",
          text: '<i class="fa-solid fa-file-csv"></i>',
          titleAttr: "Exportar a Excel",
          className: "btn btn-success",
        },
        {
          extend: "pdfHtml5",
          text: '<i class="fa-regular fa-file-pdf"></i>',
          titleAttr: "Exportar a PDF",
          className: "btn btn-danger",
        },
        {
          extend: "print",
          text: '<i class="fa-solid fa-print"></i>',
          titleAttr: "Imprimir",
          className: "btn btn-info",
        },
      ],
    });

    // Actualiza el estado para mantener la referencia del DataTable
    setDataTable(newDataTable);
  }, [data]);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); 

  const handleUpdate = () => {
    const updatedMaintenance = {
      id: editingMaintenance.id,
      name: name.current.value,
      severity: severity.current.value,
      date: "2023-09-22",
      type: type.current.value,
      category: 0,
      status: editingMaintenance.status,
      description: description.current.value,
      vehicleId: vehicleId,
    };
    
    mutation.mutateAsync(updatedMaintenance).then(() => {
      setShowEditModal(false);
    });
  };




  const handleDeleteMaintenance = async () => {
    try {
      await deleteMaintenance(selectedMaintenance);
      const updatedMaintenances = maintenances.filter(maintenance => maintenance.id !== selectedMaintenance);
      setMaintenances(updatedMaintenances);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
    
  };

  const handleOpenModal = (maintenanceId) => {
    setSelectedMaintenance(maintenanceId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedMaintenance(null);
    setShowModal(false);
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h2>Lista de Mantenimiento del Vehículo</h2>
          </Col>
          <Col>
            <Button onClick={handleShowFormModal}>Crear</Button>
          </Col>
        </Row>

        <Table striped="columns">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Gravedad</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {data.maintenances.map((maintenance) => (
              <tr key={maintenance.id}>
                <td>{maintenance.name}</td>
                <td>{maintenance.severity}</td>
                <td>{maintenance.type}</td>
                <td>
                <Button variant="info" onClick={() => handleEditClick(maintenance.id)}>Editar</Button>
                <Button variant="danger" onClick={() => handleOpenModal(maintenance.id)}>Eliminar</Button>                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="info">
          <Link to={"/vehicle"}>Regresar</Link>
        </Button>
      </Container>

      <Modal show={modalCreate} onHide={handleCloseFormModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear mantenimiento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formPlaca">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el daño"
                    ref={name}
                  />
                </Form.Group>

                <Form.Group controlId="formPlaca">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Fecha de cuando sucedió"
                    ref={date}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formColor">
                  <Form.Label>Gravedad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la gravedad"
                    ref={severity}
                  />
                </Form.Group>

                <Form.Group controlId="formColor">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el tipo"
                    ref={type}
                  />
                </Form.Group>
              </div>
            </div>
            <Form.Group controlId="formColor">
              <Form.Label>Descripcion</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción del suceso"
                ref={description}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseFormModal}>
            Cancelar
          </Button>
          <Button variant="dark" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar mantenimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el nombre"
                    defaultValue={
                      editingMaintenance ? editingMaintenance.name : ""
                    }
                    ref={name}
                  />
                </Form.Group>

                <Form.Group controlId="formCategory">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese la categoría"
                    defaultValue={
                      editingMaintenance ? editingMaintenance.category : 0
                    }
                    ref={category}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formSeverity">
                  <Form.Label>Gravedad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la gravedad"
                    defaultValue={
                      editingMaintenance ? editingMaintenance.severity : ""
                    }
                    ref={severity}
                  />
                </Form.Group>

                <Form.Group controlId="formType">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el tipo"
                    defaultValue={
                      editingMaintenance ? editingMaintenance.type : ""
                    }
                    ref={type}
                  />
                </Form.Group>

               
              </div>
            </div>
            <Form.Group controlId="formDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción"
                defaultValue={
                  editingMaintenance ? editingMaintenance.description : ""
                }
                ref={description}
              />
            </Form.Group>
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres eliminar este mantenimiento?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteMaintenance}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
      
    </>
  );
}
export default VehicleMaintenances;