import React, { useRef, useState } from "react";
import { Modal, Form, Button, Table } from 'react-bootstrap';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMutation, useQuery } from "react-query";
import { create, getVehicles } from "../../services/VehicleService";
import VehicleDataTable from "./components/VehicleDataTable";


export const Vehicles = () => {
  const mutation = useMutation("vehicles", create);
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
    handleRefreshClick();
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
      handleRefreshClick();
    });
  };

  const handleRefreshClick = () => {
    window.location.reload();
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
            <h2>Vehiculos</h2>
          </Col>
          <Col>
            <Button color="success" onClick={handleShowFormModal}>
              {" "}
              Crear
            </Button>
          </Col>
        </Row>
<div><VehicleDataTable/></div>

          {/* <tbody>
            {data.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.plate_Number}</td>
                <td>{vehicle.make}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.color}</td>
                <td>{vehicle.capacity}</td>
                <td>{vehicle.year}</td>
                <td>{vehicle.traction}</td>
                <td><img src={vehicle.imageUrl} alt={vehicle.plate_Number} style={{ width: '65px', height: '40px' }} /></td>
                <td>{vehicle.status ? <span class="material-symbols-outlined">
                  visibility
                </span> : <span class="material-symbols-outlined">
                  visibility_off
                </span>}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowInfoModal(vehicle)}>Detalles</Button>
                  <Button variant="primary" onClick={() => handleEditClick(vehicle.id)}>Editar</Button>
                </td>
              </tr>
            ))}
          </tbody> */}
    
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
                  <Form.Control type="text" placeholder="Ingrese la placa" ref={plate_Number} />
                </Form.Group>

                <Form.Group controlId="formMarca">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese la marca" ref={make} />
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
                  <Form.Control type="text" placeholder="Ingrese el año" ref={year} />
                </Form.Group>
                <Form.Group controlId="formModelo">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el modelo" ref={model} />
                </Form.Group>

                <Form.Group controlId="formEstado">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el estado" ref={category} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Color</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el color" ref={color} />
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
                  <Form.Control type="date" placeholder="Ingrese la fecha" ref={oil_Change} />
                </Form.Group>
              </div>
              <Form.Group>
                <Form.Label>Imagen</Form.Label>
                <Form.Control type="text" placeholder="Ingrese la imagen" ref={image_url} />
              </Form.Group>
            </div>
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
                    defaultValue={editingVehicle ? editingVehicle.plate_Number : ''}
                    ref={plate_Number}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la marca"
                    defaultValue={editingVehicle ? editingVehicle.make : ''}
                    ref={make}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Capacidad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la capacidad"
                    defaultValue={editingVehicle ? editingVehicle.capacity : ''}
                    ref={capacity}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Traccion</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la traccion"
                    defaultValue={editingVehicle ? editingVehicle.traction : ''}
                    ref={traction}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cilindraje</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el cilindraje"
                    defaultValue={editingVehicle ? editingVehicle.engine_capacity : ''}
                    ref={engine_capacity}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Gasolina</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Gasolina"
                    defaultValue={editingVehicle ? editingVehicle.fuel : ''}
                    ref={fuel}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Imagen</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la imagen"
                    defaultValue={editingVehicle ? editingVehicle.image_url : ''}
                    ref={image_url}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group >
                  <Form.Label>Año</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el año"
                    defaultValue={editingVehicle ? editingVehicle.year : ''}
                    ref={year}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el modelo"
                    defaultValue={editingVehicle ? editingVehicle.model : ''}
                    ref={model}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese la categoria"
                    defaultValue={editingVehicle ? editingVehicle.category : ''}
                    ref={category}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el color"
                    defaultValue={editingVehicle ? editingVehicle.color : ''}
                    ref={color}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Kilometraje</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el kilometraje"
                    defaultValue={editingVehicle ? editingVehicle.mileage : ''}
                    ref={mileage}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cambio de aceite</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Ingrese la fecha"
                    defaultValue={editingVehicle ? editingVehicle.oil_Change : ''}
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
          <Button variant="dark" onClick={handleUpdate}>
            Actualizar
          </Button>
          <Button variant="danger" onClick={() => handleDisableVehicle(editingVehicle.id)} > <span class="material-symbols-outlined">
            visibility
          </span> </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showInfoModal} onHide={handleCloseInfoModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Información del Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVehicle && (
            <div>
              <p><strong>Placa:</strong> {selectedVehicle.plate_Number}</p>
              <p><strong>Marca:</strong> {selectedVehicle.make}</p>
              <p><strong>Modelo:</strong> {selectedVehicle.model}</p>
              <p><strong>Capacidad:</strong> {selectedVehicle.capacity}</p>
              <p><strong>Tracción:</strong> {selectedVehicle.traction}</p>
              <p><strong>Cilindraje:</strong> {selectedVehicle.engine_capacity}</p>
              <p><strong>Gasolina:</strong> {selectedVehicle.fuel}</p>
              <p><strong>Año:</strong> {selectedVehicle.year}</p>
              <p><strong>Color:</strong> {selectedVehicle.color}</p>
              <p><strong>Categoría:</strong> {selectedVehicle.category}</p>
              <p><strong>Kilometraje:</strong> {selectedVehicle.mileage}</p>
              <p><strong>Cambio de Aceite:</strong> {selectedVehicle.oil_Change}</p>
              <p><strong>Estado:</strong> {selectedVehicle.status ? "Habilitado" : "Deshabilitado"}</p>
              <p><strong>Imagen:</strong> {selectedVehicle.image_url}</p>

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