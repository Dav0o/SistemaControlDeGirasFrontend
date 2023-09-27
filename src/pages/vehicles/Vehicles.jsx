import React, { useRef, useState } from "react";
import { Modal, Form, Button, Table } from "react-bootstrap";
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

export const Vehicles = () => {
  const mutation = useMutation("vehicles", create);

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
          title: "Vehiculo creado con exito!",
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

  const handleSave = () => {
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
      imageUrl: image_url.current.value,
    };
    mutation.mutateAsync(newVehicle);
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
      imageUrl: editingVehicle.imageUrl,
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
        const newDataTable = new DataTable('#tableVehicles', {
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

    


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <>
      <Container className="container-fluid">
        <h1 className="h3 mb-2 text-gray-800">Vehiculos</h1>
        <p class="mb-4">Lista de vehiculos</p>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="d-flex justify-content-between">
              <div>Clik en el boton para crear un vehiculo</div>
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
                  <th>Tracción</th>

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
                    <td>{vehicle.traction}</td>

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
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="formPlaca">
                  <Form.Label>Placa</Form.Label>
                  <Form.Control
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
                <Form.Group>
                  <Form.Label>Tracción</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la categoria"
                    ref={traction}
                  />
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
              <Form.Group>
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese la imagen"
                  ref={image_url}
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseFormModal}>
            Cancelar
          </Button>
          <Button variant="success" className="bg-gradient-success" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
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
          <Button variant="warning" className="bg-gradient-warning text-light" onClick={handleUpdate}>
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
