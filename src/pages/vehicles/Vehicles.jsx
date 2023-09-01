import React, { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import { useMutation, useQuery } from "react-query";
import { create, getVehicles } from "../../services/VehicleService";

export const Vehicles = () => {
  const { isLoading, data, isError } = useQuery("vehicles", getVehicles, {
    enabled: true,
  });

  const mutation = useMutation("vehicles", create);

  const handleSave = () => {
    let newVehicle = {
      plate_Number: plate_Number.current.value,
      make: make.current.value,
      model: model.current.value,
      category: category.current.value,
      traction: traction.current.value,
      year: parseInt(year.current.value),
      color: color.current.value,
      capacity: parseInt( capacity.current.value),
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

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const handleCloseInfoModal = () => setShowInfoModal(false);
  const handleShowInfoModal = () => setShowInfoModal(true);
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

        <Table striped="columns">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Color</th>
              <th>Capacidad</th>
              <th>Año</th>
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
                <td>
                  <Button variant="info">Detalles</Button>
                  <Button variant="primary">Editar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
                  <Form.Control type="text" placeholder="Ingrese la placa" ref={plate_Number}/>
                </Form.Group>

                <Form.Group controlId="formMarca">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese la marca" ref={make}/>
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
                  <Form.Control type="text" placeholder="Ingrese el año" ref={year}/>
                </Form.Group>
                <Form.Group controlId="formModelo">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el modelo" ref={model}/>
                </Form.Group>

                <Form.Group controlId="formEstado">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el estado" ref={category}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Color</Form.Label>
                  <Form.Control type="text" placeholder="Ingrese el color" ref={color}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>kilometraje</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el kilometraje"
                    ref={mileage}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Cambio de aceite</Form.Label>
                  <Form.Control type="date" placeholder="Ingrese la fecha" ref={oil_Change}/>
                </Form.Group>
              </div>
              <Form.Group>
                <Form.Label>Imagen</Form.Label>
                <Form.Control type="text" placeholder="Ingrese la imagen" ref={image_url}/>
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

      <Modal show={showInfoModal} onHide={handleCloseInfoModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Información del Vehículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Información detallada del vehículo</p>
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
