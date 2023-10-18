import React, { useRef, useState } from "react";
import { Modal, Form, Button, Table, ModalFooter } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMutation, useQuery } from "react-query";
import { create, getVehicles } from "../../services/VehicleService";
import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";


export const Vehicles = () => {
  const mutation = useMutation("vehicles", create);
  const [validated, setValidated] = useState(false);
 

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

  const [dataTable, setDataTable] = useState(null); // Estado para mantener la referencia del DataTable
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { isLoading, data, isError } = useQuery("vehicles", getVehicles, {
    enabled: true,
  });

  const handleSave= (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        setValidated(true);
    }
    if (form.checkValidity() === true) {
    let newVehicle = {
      plate_Number: plate_Number.current.value,
      make: make.current.value,
      model: model.current.value,
      category: category.current.value,
      traction: traction.current.value,
      year: parseInt(year.current.value),
      color: color.current.value,
      capacity: parseInt(capacity.current.value),
      engine_capacity: parseInt(engine_capacity.current.value),
      mileage: parseInt(mileage.current.value),
      fuel: fuel.current.value,
      oil_Change: "2023-09-01",
      status: true,
      image: imageUrl
    };
    mutation.mutateAsync(newVehicle);
  };
};

  const plate_Number = useRef(null);
  const make = useRef(null);
  const model = useRef(null);
  const category = useRef(null);
  const traction = useRef(null);
  const year = useRef(0);
  const color = useRef(null);
  const capacity = useRef(0);
  const engine_capacity = useRef(0);
  const mileage = useRef(0);
  const fuel = useRef(null);
  const oil_Change = useRef(null);
  const status = useRef(true);
  const image_url = useRef(null);

  const handleEditClick = (vehicleId) => {
    const vehicleToEdit = data.find((vehicle) => vehicle.id === vehicleId);
    setEditingVehicle(vehicleToEdit);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdate = () => {
    let updatedVehicle = {
      id: editingVehicle.id,
      plate_Number: plate_Number.current.value,
      make: make.current.value,
      model: model.current.value,
      category: category.current.value,
      traction: traction.current.value,
      year: year.current.value,
      color: color.current.value,
      capacity: capacity.current.value,
      engine_capacity: engine_capacity.current.value,
      mileage: mileage.current.value,
      fuel: fuel.current.value,
      oil_Change: "2023-09-01",
      status: editingVehicle.status,
      imageUrl: imageUrl,
    };

    mutation.mutateAsync(updatedVehicle).then(() => {
      setShowEditModal(false);
    });
  };

  const handleDisableVehicle = (vehicleId) => {
    const updatedVehicles = data.map((vehicle) =>
      vehicle.id === vehicleId ? { ...vehicle, status: false } : vehicle
    );
    handleUpdate(updatedVehicles);
    mutation.mutateAsync({ id: vehicleId, status: false });
  };
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const handleCloseInfoModal = () => setShowInfoModal(false);
  const handleShowInfoModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowInfoModal(true);
  };
  const handleCloseFormModal = () => setShowFormModal(false);
  const handleShowFormModal = () => setShowFormModal(true);

  useEffect(() => {
    if (dataTable) {
      // Destruye el DataTable existente antes de volver a inicializarlo
      dataTable.destroy();
    }

    // Inicializa el DataTable después de renderizar los datos
    const newDataTable = new DataTable("#tableVehicles", {
      retrieve: true,
      responsive: true,
      dom: "<'row' <'col-md-12 float-right'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
      buttons: [
        {
          extend: "print",
          title: "Registro Vehículos",
          titleAttr: "Imprimir",
          text: '<i class="fa-solid fa-print" aria-hidden="true"></i>',
          className: "btn btn-info",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6],
          },
          customize: function (win) {
            $(win.document.body)
              .find("tableVehicles")
              .addClass("compact")
              .css("font-size", "inherit");
            $(win.document.body).find("h1").css("text-align", "center");
            $(win.document.body).css("font-size", "9px");
          },
        },
        {
          extend: "pdf",
          title: "Registro Vehículos",
          titleAttr: "Exportar a PDF",
          text: '<i class="fa-regular fa-file-pdf" aria-hidden="true"></i>',
          className: "btn btn-danger",
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] },
          customize: function (doc) {
            doc.content[1].margin = [100, 0, 100, 0]; //left, top, right, bottom
          },
        },
        {
          extend: "excel",
          title: "Registro Vehículos",
          titleAttr: "Exportar a Excel",
          text: '<i class="fa-solid fa-file-csv"></i>',
          className: "btn btn-success",
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] },
        },
      ],
    });

    // Actualiza el estado para mantener la referencia del DataTable
    setDataTable(newDataTable);
  }, [data]); // Vuelve a inicializar el DataTable cuando los datos cambien

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <Container className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Vehículos</h1>
        <p class="mb-4">Lista de vehículos</p>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="d-flex justify-content-between">
              <div>Click en el botón para crear un vehículo</div>
              <div>
                <Button
                  variant="success"
                  className="bg-gradient-success text-light
                  "
                  onClick={handleShowFormModal}
                >
                  {" "}
                  <i class="bi bi-plus-square"></i>
                </Button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <Table
              className="table table-bordered"
              striped="columns"
              id="tableVehicles"
            >
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Color</th>
                  <th>Capacidad</th>
                  <th>Año</th>
                  {/* <th>Imagen</th>  */}
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {data.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.plate_Number}</td>
                    <td>{vehicle.make}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.color}</td>
                    <td>{vehicle.capacity}</td>
                    <td>{vehicle.year}</td>
                    {/* <img src={vehicle.image}
                      alt="Vehicles"
                      style={{ width: '150px', height: '150px' }} />   
 */}

                    <td>
                      <Button
                        variant="warning"
                        className="bg-gradient-warning mr-1 text-light"
                        onClick={() => handleEditClick(vehicle.id)}
                      >
                        <i class="bi bi-pencil-square"></i>
                      </Button>
                      <Button
                        variant="info"
                        className="bg-gradient-info text-light"
                        onClick={() => handleShowInfoModal(vehicle)}
                      >
                        <i class="bi bi-info-square"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      <Modal show={showFormModal} onHide={handleCloseFormModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear vehiculo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form Validated = {validated} onSubmit={handleSave}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formPlaca">
                  <Form.Label>Placa</Form.Label>
                  <Form.Control
                  required
                    
                    type="text"
                    placeholder="Ingrese la placa"
                    ref={plate_Number}
                  />
                </Form.Group>

                <Form.Group controlId="formMarca">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la marca"
                    ref={make}
                  />
                </Form.Group>

                <Form.Group controlId="formCapacidad">
                  <Form.Label>Capacidad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la capacidad"
                    ref={capacity}
                  />
                </Form.Group>

                <Form.Group className="mb-2" controlId="formBasicPassword">
                  <Form.Label>Tracción</Form.Label>
                  
                  <Form.Control as= "select" ref={traction} >
                  <option value="">Seleccione una opción</option>

                  <option value="">4X2</option>
                  <option value="">4X4</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cilindraje</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el cilindraje"
                    ref={engine_capacity}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Gasolina</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el tipo de gasolina"
                    ref={fuel}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="formColor">
                  <Form.Label>Año</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el año"
                    ref={year}
                  />
                </Form.Group>
                <Form.Group controlId="formModelo">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el modelo"
                    ref={model}
                  />
                </Form.Group>

                <Form.Group controlId="formEstado">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el estado"
                    ref={category}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el color"
                    ref={color}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Kilometraje</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el kilometraje"
                    ref={mileage}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cambio de aceite</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Ingrese la fecha"
                    ref={oil_Change}
                  />
                </Form.Group>
              </div>

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
            </div>
            </Form>
            </Modal.Body>
           
            <ModalFooter>
              <Button variant="danger" onClick={handleCloseFormModal}>
                Cancelar
              </Button>
              <Button
                variant="success"
                className="bg-gradient-success"
                type="submit"
              >
                Guardar
              </Button>
            </ModalFooter>
         
        




      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar vehiculo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Placa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la placa"
                    defaultValue={
                      editingVehicle ? editingVehicle.plate_Number : ""
                    }
                    ref={plate_Number}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la marca"
                    defaultValue={editingVehicle ? editingVehicle.make : ""}
                    ref={make}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Capacidad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la capacidad"
                    defaultValue={editingVehicle ? editingVehicle.capacity : ""}
                    ref={capacity}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Traccion</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la traccion"
                    defaultValue={editingVehicle ? editingVehicle.traction : ""}
                    ref={traction}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cilindraje</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el cilindraje"
                    defaultValue={
                      editingVehicle ? editingVehicle.engine_capacity : ""
                    }
                    ref={engine_capacity}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Gasolina</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Gasolina"
                    defaultValue={editingVehicle ? editingVehicle.fuel : ""}
                    ref={fuel}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Imagen</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la imagen"
                    defaultValue={
                      editingVehicle ? editingVehicle.image_url : ""
                    }
                    ref={image_url}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Año</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el año"
                    defaultValue={editingVehicle ? editingVehicle.year : ""}
                    ref={year}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el modelo"
                    defaultValue={editingVehicle ? editingVehicle.model : ""}
                    ref={model}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la categoria"
                    defaultValue={editingVehicle ? editingVehicle.category : ""}
                    ref={category}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el color"
                    defaultValue={editingVehicle ? editingVehicle.color : ""}
                    ref={color}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Kilometraje</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el kilometraje"
                    defaultValue={editingVehicle ? editingVehicle.mileage : ""}
                    ref={mileage}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cambio de aceite</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Ingrese la fecha"
                    defaultValue={
                      editingVehicle ? editingVehicle.oil_Change : ""
                    }
                    ref={oil_Change}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button
            variant="warning"
            className="bg-gradient-warning text-light"
            onClick={handleUpdate}
          >
            Actualizar
          </Button>
          {/* <Button
            variant="danger"
            onClick={() => handleDisableVehicle(editingVehicle.id)}
          >
            {" "}
            <span class="material-symbols-outlined">visibility</span>{" "}
          </Button> */}
        </Modal.Footer>
      </Modal>

      <Modal show={showInfoModal} onHide={handleCloseInfoModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Información del Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVehicle && (
            <div>
              <p>
                <strong>Placa:</strong> {selectedVehicle.plate_Number}
              </p>
              <p>
                <strong>Marca:</strong> {selectedVehicle.make}
              </p>
              <p>
                <strong>Modelo:</strong> {selectedVehicle.model}
              </p>
              <p>
                <strong>Capacidad:</strong> {selectedVehicle.capacity}
              </p>
              <p>
                <strong>Tracción:</strong> {selectedVehicle.traction}
              </p>
              <p>
                <strong>Cilindraje:</strong> {selectedVehicle.engine_capacity}
              </p>
              <p>
                <strong>Gasolina:</strong> {selectedVehicle.fuel}
              </p>
              <p>
                <strong>Año:</strong> {selectedVehicle.year}
              </p>
              <p>
                <strong>Color:</strong> {selectedVehicle.color}
              </p>
              <p>
                <strong>Categoría:</strong> {selectedVehicle.category}
              </p>
              <p>
                <strong>Kilometraje:</strong> {selectedVehicle.mileage}
              </p>
              <p>
                <strong>Cambio de Aceite:</strong> {selectedVehicle.oil_Change}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                {selectedVehicle.status ? "Habilitado" : "Deshabilitado"}
              </p>
              <p>
                <strong>Imagen:</strong> {selectedVehicle.image_url}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInfoModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
