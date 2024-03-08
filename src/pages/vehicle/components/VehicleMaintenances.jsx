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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Accordion } from "react-bootstrap";


function VehicleMaintenances() {

  const { vehicleId } = useParams();
  const { isLoading, data, isError } = useQuery(["vehicles", vehicleId], () =>
    getByIdVehicle(vehicleId)
  );
  const mutation = useMutation("maintenances", create);

  const [validated, setValidated] = useState(false);

  const [newImages, setNewImages] = useState([]);
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
          setImageUrl([...imageUrl, uploadedImageUrl]);
        } else {
          console.error('Error al subir la imagen');
        }
      } catch (error) {
        console.error('Error de solicitud', error);
      }
    }
  };


  /////////////////////editar imagen//////////////////
  const handleEditImageUpload = async (e) => {
    const imageInput = e.target.files[0];

    if (imageInput) {
      try {
        const formData = new FormData();
        formData.append('image', imageInput);

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

          setNewImages((prevImages) => [...prevImages, uploadedImageUrl]);

          console.log('Url = ', uploadedImageUrl);
        } else {
          console.error('error al subir la imagen');
        }
      } catch (error) {
        console.error('error de solicitud', error);
      }
    }
  };
  ///////////////////////////////////////////////////
  const removeImage = (indexToRemove) => {

    setEditingMaintenance((prevMaintenance) => {
      const updatedImages = prevMaintenance.image.split(',');
      updatedImages.splice(indexToRemove, 1);
      const serializedImages = updatedImages.join(',');

      return {
        ...prevMaintenance,
        image: serializedImages,
      };
    });


    Swal.fire('Imagen removida', 'Para confirmar su eliminación presione el botón "Actualizar"', 'success');

  };

  ////////////////////////////////////////////////


  const MySwal = withReactContent(Swal);

  {
    mutation.isError
      ? MySwal.fire({
        icon: "error",
        text: "¡Algo salió mal!",
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


    if (!name.current.value.trim()) {
      
      Swal.fire({
        icon: 'error', title: 'Error', text: 'El nombre es requerido'
      });
      return;
    }
    else if (!/^[a-zA-Z\s]*$/.test(name.current.value.trim())) {

      Swal.fire({ icon: 'error', title: 'Error', text: 'El nombre solo puede contener letras' });
      return; 
    }

    if (!severity.current.value.trim()) {

      Swal.fire({
        icon: 'error', title: 'Error', text: 'La gravedad es requerida'
      });
      return;
    }

    if (!type.current.value.trim()) {

      Swal.fire({
        icon: 'error', title: 'Error', text: 'El tipo es requerido'
      });
      return;
    }

    if (!date.current.value.trim()) {
      Swal.fire({
        icon: 'error', title: 'Error', text: 'La fecha es requerida'
      });
      return;
    }

    let updatedImageString = '';
    if (Array.isArray(imageUrl)) {
      updatedImageString = imageUrl.filter(Boolean).join(',');
    } else {
      updatedImageString = imageUrl || '';
    }
    const dateValue = date.current.value;

    let newMaintenance = {
      name: name.current.value,
      severity: severity.current.value,
      date: dateValue,
      type: type.current.value,
      status: true,
      description: description.current.value,
      image: updatedImageString,
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
    if (!name.current.value.trim()) {
      
      Swal.fire({
        icon: 'error', title: 'Error', text: 'El nombre es requerido'
      });
      return;
    }
    else if (!/^[a-zA-Z\s]*$/.test(name.current.value.trim())) {

      Swal.fire({ icon: 'error', title: 'Error', text: 'El nombre solo puede contener letras' });
      return; 
    }

    const updatedImages = [...editingMaintenance.image.split(','), ...newImages];
    const updatedImageString = updatedImages.filter(Boolean).join(',');

    const updatedMaintenance = {
      id: editingMaintenance.id,
      name: name.current.value,
      severity: severity.current.value,
      type: type.current.value,
      date: date.current.value,
      status: editingMaintenance.status,
      description: description.current.value,
      image: updatedImageString,
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  };

  return (
    <>
      <Container className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Lista de Mantenimiento del Vehículo</h1>
        <p class="mb-4">Lista de mantenimientos o incidentes</p>
        <div className="card shadow mb-4">

          <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Click en el botón para crear un vehículo</Accordion.Header>
              <Accordion.Body>
                <Form validated={validated} onSubmit={handleSave}>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3 mt-3">
                        <label htmlFor="inputName"
                          className="form-label">Nombre</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ingrese el nombre"
                          name="name"
                          ref={name}
                          required
                        />
                        <div className="valid-feedback"></div>
                        <div className="invalid-feedback">El campo es requerido.
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3 mt-3">
                        <label htmlFor="inputGr"
                          className="form-label">Gravedad</label>
                        <select class="form-select" id="inputSeverity" ref={severity} required>
                          <option select disable value="">Seleccione una opción</option>
                          <option value="Leve">Leve</option>
                          <option value="Moderado">Moderado</option>
                          <option value="Grave">Grave</option>
                          <option value="Critico">Crítico</option>
                        </select>
                        <div class="invalid-feedback">
                          Por favor, seleccione una opción.
                        </div>
                      </div>
                    </Col>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3 mt-3">
                          <label htmlFor="inputType"
                            className="form-label">Tipo</label>
                          <select class="form-select" id="inputType" ref={type} required>
                            <option select disable value="">Seleccione una opción</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                            <option value="Incidente">Incidente</option>
                          </select>
                          <div class="invalid-feedback">
                            Por favor, seleccione una opción.
                          </div>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="mb-3 mt-3">
                          <label htmlFor="inputDate"
                            className="form-label">Fecha</label>
                          <input
                            type="date"
                            className="form-control"
                            name="date"
                            ref={date}
                            required
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3 mt-3">
                          <label htmlFor="inputDescription"
                            className="form-label">Descripción</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Ingrese la descripción"
                            name="description"
                            ref={description}
                          />
                          <div className="valid-feedback"></div>
                        </div>
                      </Col>


                      <Col md={6}>

                        <div className="mb-3 mt-3">
                          <div>
                            <Form.Label>Imagen</Form.Label>
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input"
                                id="customFile"

                                onChange={handleImageUpload}
                                multiple
                              />
                              <label className="custom-file-label" htmlFor="customFile">
                                Click para seleccionar una o más imágenes</label>
                            </div>
                            {Array.isArray(imageUrl) && imageUrl.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Imagen ${index + 1}`}
                                className="uploadedImg"
                                style={{ maxWidth: '200px', maxHeight: '200px', marginRight: '10px', marginBottom: '10px' }}
                              />
                            ))}</div>
                        </div>
                      </Col>
                    </Row>
                  </Row>
                </Form>
                <Button variant="danger" onClick={handleCloseFormModal} style={{ marginRight: '10px' }}>
                  Cancelar
                </Button>

                <Button variant="success" onClick={handleSave}>
                  Guardar
                </Button>

              </Accordion.Body>
            </Accordion.Item>
          </Accordion>



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


      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar mantenimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>



          <form class="was-validated" >
            <Row>
              <Col md={6}>
                <Form.Group controlId="formName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el nombre"
                    defaultValue={
                      editingMaintenance ? editingMaintenance.name : ""
                    }
                    ref={name}
                    required
                  />
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">
                  </div>
                </Form.Group>



                <Form.Group controlId="formType">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Control as="select" ref={type}
                    defaultValue={editingMaintenance ? editingMaintenance.type : ""}>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Incidente">Incidente</option>
                  </Form.Control>
                </Form.Group>



                <Form.Group controlId="formSeverity">
                  <Form.Label>Gravedad</Form.Label>
                  <Form.Control as="select" ref={severity} defaultValue={editingMaintenance ? editingMaintenance.severity : ""}>
                    <option value="Leve">Leve</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Grave">Grave</option>
                    <option value="Critico">Crítico</option>
                  </Form.Control>
                </Form.Group>




                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese la descripción"
                  defaultValue={
                    editingMaintenance ? editingMaintenance.description : ""
                  }
                  ref={description}
                />


                <Form.Group controlId="formDate">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Fecha de cuando sucedió"
                    defaultValue={
                      editingMaintenance ? formatDate(editingMaintenance.date) : ""
                    }
                    ref={date}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Imágenes </Form.Label>
                  <div className='styled-table'>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '10px' }}>
                      {editingMaintenance && editingMaintenance.image && editingMaintenance.image.split(',').map((imageUrl, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <td>
                            <img
                              src={imageUrl}
                              alt={`Imagen ${index}`}
                              style={{ maxWidth: '200px', maxHeight: '200px' }}
                            />
                          </td>
                          <td>
                            <Button variant='danger' onClick={() => removeImage(index)}>
                              Eliminar
                            </Button>
                          </td>
                        </div>
                      ))}
                    </div>
                  </div>
                  <br>
                  </br>
                  <input type='file' accept='image/*' className='form-control-file' onChange={handleEditImageUpload} multiple />
                  {newImages.map((imageUrl, index) => (
                    <div key={index}>Nueva imagen {index + 1}</div>
                  ))}
                </Form.Group>
              </Col>
            </Row>

          </form>



        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button variant="dark" onClick={handleUpdate}>
            Actualizar
          </Button>
        </Modal.Footer>
      </Modal >


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
