import React, { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Table, Modal, Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useQuery, useMutation } from "react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import { getByIdVehicle } from "../../../services/VehicleService";
import {
  create,
  deleteMaintenance,
} from "../../../services/MaintenanceService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

function VehicleMaintenances() {
  const { vehicleId } = useParams();
  const { isLoading, data, isError } = useQuery(["vehicles", vehicleId], () =>
    getByIdVehicle(vehicleId)
  );
  const mutation = useMutation("maintenances", create);

  const [imageUrl, setImageUrl] = useState('');
  const apiKey = '6c4a708d4bdee0384fae9c67a8558f9e';


  const handleImageUpload = async (e) => {
    const imageInput = e.target.files[0];

    if (imageInput) {
      const formData = new FormData();
      formData.append('image', imageInput);

      try {
        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          const uploadedImageUrl = data.data.url;
          setImageUrl(uploadedImageUrl);
          console.log('Url = ', uploadedImageUrl);
        } else {
          console.error('Error al subir la imagen');
        }
      } catch (error) {
        console.error('Error de solicitud', error);
      }
    }
  };


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
        title: "Tu trabajo ha sido guardado!",
        showConfirmButton: false,
        timer: 1500,
      }).then(mutation.reset)
      : null;
  }
  const [maintenances, setMaintenances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  const name = useRef(null);
  const severity = useRef(null);
  const date = useRef(null);
  const type = useRef(null);
  const category = useRef(0);
  const status = useRef(null);
  const description = useRef(null);
 


  const handleSave = () => {
    let newMaintenance = {
      name: name.current.value,
      severity: severity.current.value,
      date: date.current.value,
      type: type.current.value,
      category: 0,
      status: true,
      description: description.current.value,
      image: imageUrl,
      vehicleId: vehicleId,

    };
    mutation.mutateAsync(newMaintenance);
  };

  const handleEditClick = (maintenanceId) => {
    const maintenanceToEdit = data.maintenances.find(
      (maintenance) => maintenance.id === maintenanceId
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
      date: date.current.value,
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
      const updatedMaintenances = maintenances.filter(
        (maintenance) => maintenance.id !== selectedMaintenance
      );
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
  const LinkStyle = {
    textDecoration: "none",
    color: "white",
  };

  return (
    <>
      <Container className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">
          Lista de Mantenimiento del Vehículo
        </h1>
        <p class="mb-4">Lista de mantenimientos o incidentes</p>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="d-flex justify-content-between">
              <div>Clik en el botón para crear un mantenimiento</div>
              <Button
                variant="success"
                className="bg-gradient-success text-light
                "
                onClick={handleShowFormModal}
              >
                <i class="bi bi-plus-square"></i>
              </Button>
            </div>
          </div>
          <div className="card-body">
            <Table striped="columns">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Gravedad</th>
                  <th>Tipo</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {data.maintenances.map((maintenance) => (
                  <tr key={maintenance.id}>
                    <td>{maintenance.name}</td>
                    <td>{maintenance.severity}</td>
                    <td>{maintenance.type}</td>
                    <img src={maintenance.image} 
                    alt="Mantenimiento" 
                    style={{ width: '150px', height: '150px' }} />

                    <td>
                      <Button
                        variant="warning"
                        className="bg-gradient-warning mr-1 text-light"
                        onClick={() => handleEditClick(maintenance.id)}
                      >
                        <i class="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        variant="danger"
                        className="bg-gradient-danger mr-1 text-light"
                        onClick={() => handleOpenModal(maintenance.id)}
                      >
                        <i class="bi bi-trash"></i>
                      </Button>{" "}

                      
                    </td>
                  </tr>
                ))}
              </tbody>
              
            </Table>
          </div>
        </div>

        <Link style={LinkStyle} to={"/vehicle"}>
          <Button variant="dark" className="bg-gradient-danger">
            Regresar
          </Button>
        </Link>
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
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la descripción del suceso"
                ref={description}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="customFile"
                 
                  onChange={handleImageUpload}
                />
                <label className="custom-file-label" htmlFor="customFile">
                </label>
              </div>
              {imageUrl && <img src={imageUrl} alt="Imagen subida" className="uploadedImg"
              style={{ maxWidth: '200px', maxHeight: '200px' }} />}
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
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar este mantenimiento?
        </Modal.Body>
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
